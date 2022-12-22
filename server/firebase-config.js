var admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

var serviceAccount = require("./firebaseAppData.json");

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

  if (!ref.empty) {
    ref.forEach((post) => {
      // console.log(redditAlgorithm(post));
      const refPost = db.collection("Posts").doc(post.id);
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

const writePost = async ({ category, isAnonymous, message, userId, tags }) => {
  await db.collection("Posts").add({
    categoryId: category,
    downVote: 0,
    upVote: 0,
    isAnonymous: isAnonymous,
    isSolved: false,
    message: message,
    tags: tags,
    timePosted: Timestamp.fromDate(new Date()),
    userId: userId,
    votePoint: 0,
  });
};

const writeComment = async ({ postId, reply, userId }) => {
  await db.collection("Comments").add({
    postId: postId,
    reply: reply,
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
  await db.collection("Posts").doc(postId).delete();
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

const toggleSolve = async ({ isSolved, postId }) => {
  await db.collection("Posts").doc(postId).update({ isSolved: isSolved });
};

const toggleStar = async ({ star, commentId }) => {
  await db.collection("Comments").doc(commentId).update({ starComment: !star });
};

module.exports = {
  addUser: addUser,
  generateVotePoint: generateVotePoint,
  writePost: writePost,
  votePost: votePost,
  writeTags: writeTags,
  writeComment: writeComment,
  deletePost: deletePost,
  deleteComment: deleteComment,
  deleteVotedPost: deleteVotedPost,
  deleteTagCount: deleteTagCount,
  toggleSolve: toggleSolve,
  toggleStar: toggleStar,
};
