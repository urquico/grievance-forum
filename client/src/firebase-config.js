import { initializeApp } from "firebase/app";
import { getAuth, OAuthProvider, signInWithPopup, signOut } from "firebase/auth";
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

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new OAuthProvider("microsoft.com");
provider.addScope("Contacts.Read");
provider.addScope("Contacts.ReadWrite");

export const signInWithMicrosoft = async () =>
  await signInWithPopup(
    auth,
    provider.setCustomParameters({
      prompt: "consent",
      login_hint: "",
      tenant: process.env.REACT_APP_TENANT,
    })
  );

export const logOut = () => {
  signOut(auth);
};

export const getComments = async (postId) => {
  const ref = collection(db, "Comments");

  const q = query(ref, where("postId", "==", postId));
  const querySnapshot = await getDocs(q);

  // Get the comment documents
  const comments = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    readTime: doc._document.readTime.timestamp.seconds,
  }));

  // Sort the comments based on timeCommented in descending order
  const sortedComments = comments.sort((a, b) => b.timeCommented.seconds - a.timeCommented.seconds);

  return sortedComments.slice().reverse();
};
export const getPost = async (type, userId, tag, category, college, program) => {
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
  } else if (type === "archive") {
    const archiveRef = collection(db, "Archive");
    const q = query(archiveRef, orderBy("votePoint", "desc"), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "college") {
    const q = query(ref, where("college", "==", college), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "program") {
    const q = query(ref, where("program", "==", program), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "severe" || type === "moderate" || type === "mild") {
    const q = query(ref, where("levelOfUrgency", "==", type), limit(5));
    const data = await getDocs(q);
    return data;
  }
};

export const getMorePosts = async (lastDoc, type, userId, tag, category, college, program) => {
  const ref = collection(db, "Posts");
  if (type === "home") {
    const q = query(ref, orderBy("votePoint", "desc"), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "profile") {
    const q = query(ref, where("userId", "==", userId), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "tag") {
    const q = query(ref, where("tags", "array-contains", tag), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "category") {
    const q = query(ref, where("categoryId", "==", category), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "archive") {
    const archiveRef = collection(db, "Archive");
    const q = query(archiveRef, orderBy("votePoint", "desc"), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "college") {
    const q = query(ref, where("college", "==", college), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "program") {
    const q = query(ref, where("program", "==", program), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  } else if (type === "severe" || type === "moderate" || type === "mild") {
    const q = query(ref, where("levelOfUrgency", "==", type), startAfter(lastDoc), limit(5));
    const data = await getDocs(q);
    return data;
  }
};

export const getAllPosts = async () => {
  const ref = collection(db, "Posts");
  const data = await getDocs(ref);
  return data;
};

export const getAllPendingPosts = async () => {
  const ref = collection(db, "Pending");
  const data = await getDocs(ref);
  return data;
};

export const getUser = async (userId) => {
  // can be used when accessing the name and isAdmin of a user
  const ref = doc(db, "UserData", userId);
  const fetchedDoc = await getDoc(ref);
  return fetchedDoc.data();
};

export const getUsers = async () => {
  const ref = collection(db, "UserData");
  const q = query(ref, orderBy("name", "asc"), limit(10));
  const data = await getDocs(q);
  return data;
};

export const getMoreUsers = async (lastDoc) => {
  const ref = collection(db, "UserData");
  const q = query(ref, orderBy("name", "asc"), startAfter(lastDoc), limit(10));
  const data = await getDocs(q);
  return data;
};

export const getVotePostData = async (postId, userId) => {
  const ref = doc(db, "VotedPosts", userId, "Vote", postId || "");
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

export const getAllTags = async () => {
  const ref = collection(db, "Tags");
  const q = query(ref, orderBy("tagCount", "desc"));
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

export const getSinglePost = async (postId, type) => {
  const ref = doc(db, type, postId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc;
  }
};

export const checkSolveState = async (postId) => {
  const ref = doc(db, "Posts", postId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc._document.data.value.mapValue.fields.isSolved.booleanValue;
  }
};

export const checkStarComment = async (commentId) => {
  const ref = doc(db, "Comments", commentId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc._document.data.value.mapValue.fields.starComment.booleanValue;
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

export const getCollegeInfo = async (collegeId) => {
  const ref = doc(db, "Colleges", collegeId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc.data();
  }
};

export const getPrograms = async (collegeId) => {
  const ref = collection(db, "Colleges", collegeId, "Programs");
  const data = await getDocs(ref);
  return data.docs;
};

export const getProgramInfo = async (collegeId, programId) => {
  const ref = doc(db, "Colleges", collegeId, "Programs", programId);
  const fetchedDoc = await getDoc(ref);
  if (fetchedDoc.exists()) {
    return fetchedDoc.data();
  }
};

export const getAllProfanities = async () => {
  const ref = collection(db, "Profanities");
  const data = await getDocs(ref);
  return data;
};

export const getRegisteredUsersCount = async () => {
  const ref = collection(db, "UserData");
  const q = query(ref, where("userAgreedSLA", "==", true));
  const data = await getDocs(q);
  return data.size;
};

export const getAllUsers = async () => {
  const ref = collection(db, "UserData");
  const data = await getDocs(ref);
  return data.size;
};

export const getAllContacts = async () => {
  const ref = collection(db, "Contacts");
  const data = await getDocs(ref);
  return data;
};

export const removeHTMLTags = (str) => {
  //? src: https://www.geeksforgeeks.org/how-to-strip-out-html-tags-from-a-string-using-javascript/
  if (str === null || str === "") return false;
  else str = str.toString();

  return str.replace(/(<([^>]+)>)/gi, "");
};

export const checkIfContainsNumber = (str) => {
  return /\d/.test(str);
};
