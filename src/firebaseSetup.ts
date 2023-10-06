import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Employee } from "./types";


const app = firebase.initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_INFO));

const storage = getStorage();
export const auth = firebase.auth();
export const db = getFirestore(app);

export async function upload(file:any, currentUser:any, setLoading: Function, profile: Employee, setProfilePicture: Function) {
  const fileRef = ref(storage, currentUser.uid + '.png');
  setLoading(true);
  await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  try {
    await setDoc(doc(db, "Employees", profile!.id), {
      ...profile,
      profile_picture: photoURL,

    })
    setProfilePicture(photoURL)
  } catch (error) {
    console.log(error)
  }
  setLoading(false);

  alert("Uploaded file!");
}
