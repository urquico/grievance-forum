var admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

var serviceAccount = require("./firebaseAppData.json");
var Filter = require("bad-words"),
  filter = new Filter({
    regex: /\*|\.|$/gi,
    replaceRegex: /[A-Za-z0-9가-힣_]/g,
  });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://haribon-e-wall-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = getFirestore();

const addUser = async ({ name, email }) => {
  const userRef = db.collection("UserData").doc(email);
  const doc = await userRef.get();
  if (!doc.exists) {
    userRef.set({ name: name, isAdmin: /\d/.test(email) ? false : true });
  }
};

const updateUserData = async ({
  userId,
  firstName,
  lastName,
  birthday,
  college,
  program,
  userAgreedSLA,
}) => {
  const ref = await db.collection("UserData").doc(userId);
  ref.update({
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    college: college,
    program: program,
    userAgreedSLA: userAgreedSLA,
  });
};

const redditAlgorithm = (post) => {
  const timePosted = new Date(post.data().timePosted._seconds);
  const currentDate = new Date(Timestamp.fromDate(new Date())._seconds);
  let t = currentDate - timePosted;
  let x = post.data().upVote - post.data().downVote;
  let y = 0;
  let z = 0;

  if (x > 0) {
    y = 1;
  } else if ((x = 0)) {
    y = 0;
  } else {
    y = -1;
  }

  if (Math.abs(x) >= 1) {
    z = Math.abs(x);
  } else {
    z = 1;
  }

  let result = Math.log(10) * z + (y * t) / 45000;
  return result;
};

const generateVotePoint = async () => {
  // to update the vote count using the reddit algorithm
  const ref = await db.collection("Posts").get();
  const archiveRef = await db.collection("Archive").get();

  if (!ref.empty) {
    ref.forEach((post) => {
      const refPost = db.collection("Posts").doc(post.id);
      refPost.update({
        votePoint: redditAlgorithm(post),
      });
    });
  }

  if (!archiveRef.empty) {
    archiveRef.forEach((post) => {
      const refPost = db.collection("Archive").doc(post.id);
      refPost.update({
        votePoint: redditAlgorithm(post),
      });
    });
  }
};

const votePost = async ({ voteType, userId, postId, weight }) => {
  await db
    .collection("VotedPosts")
    .doc(userId)
    .collection("Vote")
    .doc(postId)
    .set({ voteType: voteType, postId: postId })
    .then(() => {
      const postQueryRef = db.collection("Posts").doc(postId);
      if (voteType) {
        postQueryRef.update({
          upVote: FieldValue.increment(weight),
        });
      } else {
        postQueryRef.update({
          downVote: FieldValue.increment(weight),
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getProfanityList = async () => {
  let data = [];
  const ref = db.collection("Profanities");
  const snapshot = await ref.get();
  snapshot.forEach((doc) => {
    data.push(doc.id);
  });

  return data;
};

const writePost = async ({
  category,
  isAnonymous,
  message,
  userId,
  tags,
  college,
  program,
  receiver,
}) => {
  //! writing a post goes to the pending post collection first
  const profanityList = await getProfanityList();
  filter.addWords(...profanityList);
  await db.collection("Pending").add({
    categoryId: category,
    downVote: 0,
    upVote: 0,
    isAnonymous: isAnonymous,
    isSolved: false,
    message: filter.clean(message),
    tags: tags,
    timePosted: Timestamp.fromDate(new Date()),
    userId: userId,
    votePoint: 0,
    college: college,
    program: program,
    receiver: receiver,
  });
};

const approvePost = async ({
  category,
  isAnonymous,
  message,
  userId,
  tags,
  admin,
  college,
  program,
  receiver,
}) => {
  const profanityList = await getProfanityList();
  filter.addWords(...profanityList);
  await db
    .collection("Posts")
    .add({
      categoryId: category,
      downVote: 0,
      upVote: 0,
      isAnonymous: isAnonymous,
      isSolved: false,
      message: filter.clean(message),
      tags: tags,
      timePosted: Timestamp.fromDate(new Date()),
      userId: userId,
      votePoint: 0,
      approvedBy: admin,
      college: college,
      program: program,
      receiver: receiver,
    })
    .then((result) => {
      receiver.forEach((user) => {
        if (user !== "") {
          notifyReceiver({
            notificationType: "receiver",
            postId: result._path.segments[1],
            notifier: isAnonymous ? "Someone" : userId,
            userId: user,
          });
        }
      });
    });
};

const writeComment = async ({ postId, reply, userId }) => {
  const profanityList = await getProfanityList();
  filter.addWords(...profanityList);
  await db.collection("Comments").add({
    postId: postId,
    reply: filter.clean(reply),
    timeCommented: Timestamp.fromDate(new Date()),
    userId: userId,
    starComment: false,
  });
};

const writeTags = async ({ tags }) => {
  await tags.forEach(async (tag) => {
    const tagRef = db.collection("Tags").doc(tag.toLowerCase());
    const doc = await tagRef.get();
    if (!doc.exists) {
      tagRef.set({ tagCount: 1 });
      console.log(tag, ": no document");
    } else {
      tagRef.update({ tagCount: FieldValue.increment(1) });
      console.log(tag, ": document found");
    }
  });
};

const deletePost = async ({ postId, archive }) => {
  await db
    .collection("Posts")
    .doc(postId)
    .delete()
    .then(async () => {
      const comments = await db
        .collection("Comments")
        .where("postId", "==", postId)
        .get();
      comments?.forEach((doc) => {
        deleteComment({ commentId: doc.id });
      });
    });
};

const deleteArchive = async ({ postId }) => {
  await db
    .collection("Archive")
    .doc(postId)
    .delete()
    .then(async () => {
      const comments = await db
        .collection("Comments")
        .where("postId", "==", postId)
        .get();
      comments?.forEach((doc) => {
        deleteComment({ commentId: doc.id });
      });
    });
};

const archivePost = async ({ postId }) => {
  const post = await db.collection("Posts").doc(postId).get();
  const archiveRef = db.collection("Archive").doc(postId);
  archiveRef.set({ ...post.data() });
  deletePost({ postId, archive: true });
};

const deletePendingPost = async ({ postId }) => {
  await db.collection("Pending").doc(postId).delete();
};

const deleteComment = async ({ commentId }) => {
  await db.collection("Comments").doc(commentId).delete();
};

const deleteVotedPost = async ({ userId, postId }) => {
  const votePostRef = db
    .collection("VotedPosts")
    .doc(userId)
    .collection("Vote")
    .doc(postId);
  const doc = await votePostRef.get();
  if (doc.exists) {
    votePostRef.delete();
  }
};

const deleteTagCount = async ({ tags }) => {
  await tags.forEach((tag) => {
    db.collection("Tags")
      .doc(tag.toLowerCase())
      .update({ tagCount: FieldValue.increment(-1) });
  });
};

const deleteZeroTagCount = async () => {
  const tags = await db.collection("Tags").where("tagCount", "==", 0).get();
  tags?.forEach((doc) => {
    db.collection("Tags").doc(doc.id).delete();
  });
};

const toggleSolve = async ({ isSolved, postId }) => {
  await db.collection("Posts").doc(postId).update({ isSolved: isSolved });
};

const toggleStar = async ({ star, commentId }) => {
  await db.collection("Comments").doc(commentId).update({ starComment: !star });
};

const toggleAdmin = async ({ userId, isAdmin }) => {
  await db.collection("UserData").doc(userId).update({ isAdmin: isAdmin });
};

const readNotification = async ({ notificationId }) => {
  await db.collection("NotificationPosts").doc(notificationId).delete();
};

const notifyReceiver = async ({
  notificationType,
  notifier,
  postId,
  userId,
}) => {
  if (userId.includes("@")) {
    await db.collection("NotificationPosts").add({
      isOpened: false,
      notificationTime: Timestamp.fromDate(new Date()),
      notificationType: notificationType,
      notifier: notifier,
      postId: postId,
      userId: userId,
    });
  }
};

const notifyDeclinedPost = async ({
  notificationType,
  notifier,
  postId,
  userId,
  message,
}) => {
  await db.collection("NotificationPosts").add({
    isOpened: false,
    notificationTime: Timestamp.fromDate(new Date()),
    notificationType: notificationType,
    notifier: notifier,
    postId: postId,
    userId: userId,
    message: message,
  });
};

const notifyPublisher = async ({
  notificationType,
  notifier,
  postId,
  userId,
}) => {
  await db.collection("NotificationPosts").add({
    isOpened: false,
    notificationTime: Timestamp.fromDate(new Date()),
    notificationType: notificationType,
    notifier: notifier,
    postId: postId,
    userId: userId,
  });
};

const addProfanity = async (profanity, blockerId) => {
  await db.collection("Profanities").doc(profanity).set({
    blocker: blockerId,
  });
};

const deleteProfanity = async (profanity) => {
  await db.collection("Profanities").doc(profanity).delete();
};

module.exports = {
  addUser: addUser,
  updateUserData: updateUserData,
  generateVotePoint: generateVotePoint,
  writePost: writePost,
  votePost: votePost,
  writeTags: writeTags,
  writeComment: writeComment,
  deletePost: deletePost,
  deleteComment: deleteComment,
  deleteVotedPost: deleteVotedPost,
  deleteTagCount: deleteTagCount,
  deleteZeroTagCount: deleteZeroTagCount,
  toggleSolve: toggleSolve,
  toggleStar: toggleStar,
  readNotification: readNotification,
  notifyPublisher: notifyPublisher,
  addProfanity: addProfanity,
  deleteProfanity: deleteProfanity,
  approvePost: approvePost,
  deletePendingPost: deletePendingPost,
  archivePost: archivePost,
  deleteArchive: deleteArchive,
  toggleAdmin: toggleAdmin,
  notifyDeclinedPost: notifyDeclinedPost,
};
