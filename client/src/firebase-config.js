import { initializeApp } from "firebase/app";
import {
  getAuth,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getDocs,
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  where,
  getDoc,
} from "firebase/firestore";

import env from "react-dotenv";

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new OAuthProvider("microsoft.com");

// TODO: add the access token, credential, and idToken
// TODO: using the OAuth access token call the microsoft graph api
export const signInWithMicrosoft = async () =>
  await signInWithPopup(
    auth,
    provider.setCustomParameters({
      prompt: "consent",
      login_hint: "",
      tenant: env.TENANT,
    })
  );

export const logOut = () => {
  signOut(auth);
};

export const getComments = async (postId) => {
  const ref = collection(db, "Comments");

  const q = query(ref, where("postId", "==", postId));
  const data = await getDocs(q);
  return data;
};

export const getPost = async (type, userId, tag, category) => {
  const ref = collection(db, "Posts");

  if (type === "home") {
    const q = query(ref, orderBy("votePoint", "desc"), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "profile") {
    const q = query(ref, where("userId", "==", userId), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "tag") {
    const q = query(ref, where("tags", "array-contains", tag), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "category") {
    const q = query(ref, where("categoryId", "==", category), limit(5));
    const data = await getDocs(q);
    return data;
  }
};

export const getMorePosts = async (lastDoc, type, userId, tag, category) => {
  const ref = collection(db, "Posts");
  if (type === "home") {
    const q = query(
      ref,
      orderBy("votePoint", "desc"),
      startAfter(lastDoc),
      limit(5)
    );
    const data = await getDocs(q);
    return data;
  } else if (type === "profile") {
    const q = query(
      ref,
      where("userId", "==", userId),
      startAfter(lastDoc),
      limit(5)
    );
    const data = await getDocs(q);
    return data;
  } else if (type === "tag") {
    const q = query(
      ref,
      where("tags", "array-contains", tag),
      startAfter(lastDoc),
      limit(5)
    );
    const data = await getDocs(q);
    return data;
  } else if (type === "category") {
    const q = query(
      ref,
      where("categoryId", "==", category),
      startAfter(lastDoc),
      limit(5)
    );
    const data = await getDocs(q);
    return data;
  }
};

export const getUser = async (userId) => {
  // can be used when accessing the name and isAdmin of a user
  const ref = doc(db, "UserData", userId);
  const fetchedDoc = await getDoc(ref);
  return fetchedDoc.data();
};

export const getVotePostData = async (postId, userId) => {
  const ref = doc(db, "VotedPosts", userId, "Vote", postId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    let data = {
      postId: fetchedDoc.data().postId,
      voteType: fetchedDoc.data().voteType,
    };
    return data;
  } else {
    return null;
  }
};

export const getTrendTags = async () => {
  const ref = collection(db, "Tags");
  const q = query(ref, orderBy("tagCount", "desc"), limit(5));
  const data = await getDocs(q);
  return data;
};

export const getAllTrends = async () => {
  const ref = collection(db, "Tags");
  const q = query(ref, orderBy("tagCount", "desc"));
  const data = await getDocs(q);
  return data;
};

export const getCategories = async () => {
  const ref = collection(db, "Categories");
  const data = await getDocs(ref);
  return data.docs;
};

export const getSinglePost = async (postId) => {
  const ref = doc(db, "Posts", postId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc;
  }
};

export const checkSolveState = async (postId) => {
  const ref = doc(db, "Posts", postId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc._document.data.value.mapValue.fields.isSolved
      .booleanValue;
  }
};

export const checkStarComment = async (commentId) => {
  const ref = doc(db, "Comments", commentId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc._document.data.value.mapValue.fields.starComment
      .booleanValue;
  }
};

export const getNotifications = async (userId) => {
  const ref = collection(db, "NotificationPosts");
  const q = query(ref, where("userId", "==", userId));
  const data = await getDocs(q);
  return data;
};

export const getColleges = async () => {
  const ref = collection(db, "Colleges");
  const data = await getDocs(ref);
  return data.docs;
};

export const getPrograms = async (collegeId) => {
  const ref = collection(db, "Colleges", collegeId, "Programs");
  const data = await getDocs(ref);
  return data.docs;
};
