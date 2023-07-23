import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
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

  let docID = null;

  const querySnapshot = await getDocs(collection(db, "Employees"));
  querySnapshot.forEach((doc) => {
    if (doc.data() && doc.data().employee_id === currentUser!.uid) {
      docID = doc.data().id
    }
  });
  // console.log(docID)
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
