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
