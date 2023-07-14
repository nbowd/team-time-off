import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";

const app = firebase.initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_INFO));


export const auth = firebase.auth();
export const db = getFirestore(app);