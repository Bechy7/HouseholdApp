import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function addNote() {
  try {
    const docRef = await addDoc(collection(db, "notes"), {
      title: "My First Note",
      content: "This is stored in Firebase 🎉",
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
