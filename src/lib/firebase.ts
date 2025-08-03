import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "glowup-z87tm",
  "appId": "1:239069955710:web:31eeb366de357df1023a2f",
  "storageBucket": "glowup-z87tm.appspot.com",
  "apiKey": "AIzaSyBFiRQRzWdGEZ0U1UFl1RTANYTat_xkFSE",
  "authDomain": "glowup-z87tm.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "239069955710"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, auth, db, storage };
