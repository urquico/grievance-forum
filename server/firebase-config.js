var admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

var serviceAccount = require("./firebaseAppData.json");
var Filter = require("bad-words"),
  filter = new Filter({
    regex: /\*|\.|$/gi,
    replaceRegex: /[A-Za-z0-9가-힣_]/g,
  });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://haribon-e-wall-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = getFirestore();

const addUser = async ({ name, email }) => {
  const userRef = db.collection("UserData").doc(email);
  const doc = await userRef.get();
  if (!doc.exists) {
    userRef.set({ name: name, isAdmin: /\d/.test(email) ? false : true });
  }
};

const removeOldUsers = async () => {
  await db
    .collection("UserData")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const emailYear = parseInt(doc.id.match(/\d{4}/)[0]);
        const currentYear = new Date().getFullYear();
        if (currentYear - emailYear >= 5) {
          db.collection("UserData").doc(doc.id).delete();
          db.collection("VotedPosts").doc(doc.id).delete();
          db.collection("Posts")
            .where("userId", "==", doc.id)
            .get()
            .then((posts) => {
              posts.forEach((post) => {
                post.delete();
              });
            });

          db.collection("Comments")
            .where("userId", "==", doc.id)
            .get()
            .then((comments) => {
              comments.forEach((comment) => {
                comment.delete();
              });
            });

          db.collection("NotificationPosts")
            .where("userId", "==", doc.id)
            .get()
            .then((notifications) => {
              notifications.forEach((notification) => {
                notification.delete();
              });
            });
        }

        // console.log(doc.id, " => ", doc.data(), currentYear - emailYear);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

const updateUserData = async ({ userId, firstName, lastName, birthday, college, program, userAgreedSLA }) => {
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

  const x = post.data().upVote - post.data().downVote;
  const y = x > 0 ? 1 : x === 0 ? 0 : -1;
  const z = Math.max(Math.abs(x), 1);

  let result = Math.log(10) * z + (y * t) / 45000;
  return result;
};

const generateVotePoint = async () => {
  try {
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
  } catch (error) {
    console.error("Error in generateVotePoint:", error);
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

const writePost = async ({ category, isAnonymous, message, userId, tags, college, program, receiver }) => {
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

const approvePost = async ({ category, isAnonymous, message, userId, tags, admin, college, program, receiver, reasonForUrgency, levelOfUrgency }) => {
  let urgencyPoints = 0;
  if (levelOfUrgency === "severe") {
    urgencyPoints = 100;
  } else if (levelOfUrgency === "moderate") {
    urgencyPoints = 50;
  } else if (levelOfUrgency === "mild") {
    urgencyPoints = 10;
  }
  const profanityList = await getProfanityList();
  filter.addWords(...profanityList);
  await db
    .collection("Posts")
    .add({
      categoryId: category,
      downVote: 0,
      upVote: urgencyPoints,
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
      reasonForUrgency: reasonForUrgency,
      levelOfUrgency: levelOfUrgency,
    })
    .then((result) => {
      receiver.forEach((user) => {
        if (user !== "" && user !== userId) {
          notifyReceiver({
            notificationType: "receiver",
            postId: result._path.segments[1],
            notifier: isAnonymous ? "Someone" : userId,
            userId: user,
          });
        }
      });
    });

  generateVotePoint();
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

const deletePost = async ({ postId }) => {
  await db
    .collection("Posts")
    .doc(postId)
    .delete()
    .then(async () => {
      const comments = await db.collection("Comments").where("postId", "==", postId).get();
      comments?.forEach((doc) => {
        deleteComment({ commentId: doc.id });
      });

      deleteNotifications(postId);
    });
};

const deleteArchive = async ({ postId }) => {
  await db
    .collection("Archive")
    .doc(postId)
    .delete()
    .then(async () => {
      const comments = await db.collection("Comments").where("postId", "==", postId).get();
      comments?.forEach((doc) => {
        deleteComment({ commentId: doc.id });
      });
    });
};

const archivePost = async ({ postId }) => {
  const post = await db.collection("Posts").doc(postId).get();
  const archiveRef = db.collection("Archive").doc(postId);

  if (post.exists) {
    await archiveRef.set({ ...post.data() });
    await deletePost({ postId });
  }
};

const deletePendingPost = async ({ postId }) => {
  await db.collection("Pending").doc(postId).delete();
};

const deleteComment = async ({ commentId }) => {
  await db.collection("Comments").doc(commentId).delete();
};

const deleteVotedPost = async ({ userId, postId }) => {
  const votePostRef = db.collection("VotedPosts").doc(userId).collection("Vote").doc(postId);
  const doc = await votePostRef.get();
  if (doc.exists) {
    votePostRef.delete();
  }
};

const deleteTagCount = async ({ tags }) => {
  if (tags.length !== 0 || tags !== undefined || tags !== null || tags !== "") {
    await tags
      .forEach((tag) => {
        db.collection("Tags")
          .doc(tag.toLowerCase())
          .update({ tagCount: FieldValue.increment(-1) });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const deleteZeroTagCount = async () => {
  const tags = await db.collection("Tags").where("tagCount", "==", 0).get();
  tags?.forEach((doc) => {
    db.collection("Tags").doc(doc.id).delete();
  });
};

const deleteNotifications = async (postId) => {
  const notification = await db.collection("NotificationPosts").where("postId", "==", postId).get();
  notification?.forEach((doc) => {
    db.collection("NotificationPosts").doc(doc.id).delete();
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

const notifyReceiver = async ({ notificationType, notifier, postId, userId }) => {
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

const notifyDeclinedPost = async ({ notificationType, notifier, postId, userId, message }) => {
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

const notifyPublisher = async ({ notificationType, notifier, postId, userId }) => {
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

const createReport = async (days) => {
  const now = admin.firestore.Timestamp.now();
  const twentyFourHoursAgo = now.toMillis() - 24 * 60 * 60 * 1000 * days;

  const collectionRef = db.collection("Posts");

  const querySnapshot = await collectionRef.where("timePosted", ">=", admin.firestore.Timestamp.fromMillis(twentyFourHoursAgo)).get();

  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push(doc.data());
  });

  return {
    totalPosts: documents.length,
    college: countOccurrencesByKey(documents, "college"),
    program: countOccurrencesByKey(documents, "program"),
    tags: countOccurrencesByKeyArray(documents, "tags"),
    solvedStates: countOccurrencesByKey(documents, "isSolved"),
    category: countOccurrencesByKey(documents, "categoryId"),
    anonymousPosts: countOccurrencesByKey(documents, "isAnonymous"),
    levelOfUrgency: countOccurrencesByKey(documents, "levelOfUrgency"),
    days: days,
  };

  // return documents;
};

const generateReportName = (frequency) => {
  const timestamp = Date.now();

  const date = new Date(timestamp);

  const formattedDateTime = date
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");

  const name = `${frequency}_report_${formattedDateTime}`;

  const currentString = name;
  const currentYear = currentString.substr(-4); // Extract the current year from the string
  const newYear = parseInt(currentYear) - 1; // Subtract 1 from the current year
  const lastYearData = currentString.replace(currentYear, newYear); // Replace the current year with the new year

  db.collection("Reports").doc(lastYearData).delete();

  return name;
};

const countOccurrencesByKey = (data, key) => {
  const keyCounts = [];

  // Count the occurrences of each key
  data.forEach((item) => {
    const value = item[key];
    let id;

    if (key === "isAnonymous") {
      id = value ? "Anonymous" : "Not Anonymous";
    } else if (key === "isSolved") {
      id = value ? "Solved" : "Unsolved";
    } else {
      id = value;
    }

    const existingCount = keyCounts.find((count) => count.id === id);

    if (existingCount) {
      existingCount.value++;
    } else {
      keyCounts.push({ id, value: 1 });
    }
  });

  return keyCounts;
};

const countOccurrencesByKeyArray = (data, idKey) => {
  const occurrences = [];

  // Count the occurrences of each id
  data.forEach((item) => {
    const ids = item[idKey];
    if (Array.isArray(ids)) {
      ids.forEach((id) => {
        const existingOccurrence = occurrences.find((occurrence) => occurrence.id === id);
        if (existingOccurrence) {
          existingOccurrence.value++;
        } else {
          occurrences.push({ id, value: 1 });
        }
      });
    }
  });

  // Add color and label keys to each element
  const result = occurrences.map((occurrence) => ({
    id: occurrence.id,
    value: occurrence.value,
  }));

  return result;
};

const updateContacts = async (contactId, value, type) => {
  try {
    console.log(type);
    if (type === "FB Link") {
      const contactRef = db.collection("Contacts").doc(contactId);
      await contactRef.update({ fbLink: value });
    } else if (type === "Forms Link") {
      const contactRef = db.collection("Contacts").doc(contactId);
      await contactRef.update({ gForms: value });
    } else if (type === "Email") {
      const contactRef = db.collection("Contacts").doc(contactId);
      await contactRef.update({ value: value });
    }
  } catch (error) {
    console.error("Error updating gForms field:", error);
  }
};

module.exports = {
  addUser: addUser,
  removeOldUsers: removeOldUsers,
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
  createReport: createReport,
  updateContacts: updateContacts,
};
