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

const getPost = async () => {
  // TODO: generate a post, 10 posts? 15? 5?
  // TODO: check if it is possible to generate the post while updating the vote point of each posts
};

const getMorePost = async (lastDoc) => {
  // TODO: generate more post depending on the last document;
};

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

module.exports = { addUser: addUser };
