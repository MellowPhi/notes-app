import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBb3e029ynC8JtqzqsvTsaGC8A25NtQu88",
  authDomain: "react-notes-app-a9a7b.firebaseapp.com",
  projectId: "react-notes-app-a9a7b",
  storageBucket: "react-notes-app-a9a7b.appspot.com",
  messagingSenderId: "158567397655",
  appId: "1:158567397655:web:86df741957623b4a701f52",
};

const app = initializeApp(firebaseConfig);
// Instance of the database
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
