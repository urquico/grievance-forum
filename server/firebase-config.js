const { query } = require("express");
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
  await db
    .collection("UserData")
    .doc(email)
    .set({ name: name, isAdmin: /\d/.test(email) ? false : true });
};

const redditAlgorithm = (post) => {
  const timePosted = new Date(post.data().timePosted._seconds);
  const currentDate = new Date(Timestamp.fromDate(new Date())._seconds);
  const t = currentDate - timePosted;
  const x = post.data().upVote - post.data().downVote;
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

const getPost = async () => {
  // TODO: generate a post, 10 posts? 15? 5?
  // TODO: check if it is possible to generate the post while updating the vote point of each posts
  await generateVotePoint();
  let data = [];
  const ref = db.collection("Posts");
  const q = await ref.orderBy("votePoint", "desc").limit(5).get();
  if (q.empty) {
    console.log("no content");
  }

  q.forEach((post) => {
    data.push(post.data());
  });

  return data;
};

const getMorePost = async (lastDoc) => {
  // TODO: generate more post depending on the last document;
};

const getPostByCategory = async (category) => {};
const getMorePostByCategory = async (category, lastDoc) => {};
const getPostByTag = async (tag) => {};
const getMorePostByTag = async (tag, lastDoc) => {};

const votePost = async ({ voteType, userType, postId }) => {
  // TODO: check if the user up votes or down votes, then update the current vote count of a specific post
  // TODO: add the post to a user's vote lists
};

const writePost = async () => {
  //TODO: add post on the Posts
};

const writeComment = async () => {
  // TODO: add comment using the post id then add it on the Comments collection
};

module.exports = { addUser: addUser, getPost: getPost };
