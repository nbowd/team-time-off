import firebase from "firebase/compat/app";
import "firebase/compat/auth";

firebase.initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_INFO));

export const auth = firebase.auth();