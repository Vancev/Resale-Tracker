import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { functions } from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAQv1RLlMCyDU298gx8sMmRtTxaRe6cw9s",
  authDomain: "profit-tracker-43746.firebaseapp.com",
  databaseURL: "https://profit-tracker-43746.firebaseio.com",
  projectId: "profit-tracker-43746",
  storageBucket: "profit-tracker-43746.appspot.com",
  messagingSenderId: "168866019387",
  appId: "1:168866019387:web:4a0133b6a2a4d6bb26041e",
  measurementId: "G-9C9XXLMBB5",
};
firebase.initializeApp(firebaseConfig);

 export const auth = firebase.auth();
 export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};