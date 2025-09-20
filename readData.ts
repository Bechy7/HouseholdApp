import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function getNotes() {
  const querySnapshot = await getDocs(collection(db, "notes"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`, doc.data());
  });
}
