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
export const signInWithMicrosoft = () =>
  signInWithPopup(
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

export const getPost = async () => {
  const ref = collection(db, "Posts");
  const q = query(ref, orderBy("votePoint", "desc"), limit(5));
  const data = await getDocs(q);
  return data;
};

export const getMorePosts = async (lastDoc) => {
  const ref = collection(db, "Posts");
  const q = query(
    ref,
    orderBy("votePoint", "desc"),
    startAfter(lastDoc),
    limit(5)
  );
  const data = await getDocs(q);
  return data;
};

export const getUser = async (userId) => {
  // can be used when accessing the name and isAdmin of a user
  const ref = doc(db, "UserData", userId);
  const fetchedDoc = await getDoc(ref);
  return fetchedDoc.data();
};
