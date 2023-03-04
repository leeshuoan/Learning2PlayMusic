import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "l2pm-f6b60.firebaseapp.com",
  projectId: "l2pm-f6b60",
  storageBucket: "l2pm-f6b60.appspot.com",
  messagingSenderId: "66709985376",
  appId: "1:66709985376:web:b0cd32511fc1f8f99d0b05"
}

const app = firebase.initializeApp(firebaseConfig)

export const db = getFirestore(app)