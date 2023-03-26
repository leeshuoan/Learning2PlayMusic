import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "l2pm-83526.firebaseapp.com",
  projectId: "l2pm-83526",
  storageBucket: "l2pm-83526.appspot.com",
  messagingSenderId: "1022728772117",
  appId: "1:1022728772117:web:a934460fe9c1335e194c1c"
};

const app = firebase.initializeApp(firebaseConfig)

export const db = getFirestore(app)