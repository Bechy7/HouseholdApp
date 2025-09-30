import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";

type Note = {
  id: string;
  title: string;
  authorId: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Listen to all notes, ordered by createdAt
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData: Note[] = snapshot.docs.map((doc) => {
        const data = doc.data() as { title: string; authorId: string; createdAt?: any };
        return {
          id: doc.id,
          title: data.title,
          authorId: data.authorId,
        };
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);

  const addNote = async () => {
    const user = auth.currentUser;
    if (!user || !newNote.trim()) return;

    await addDoc(collection(db, "notes"), {
      title: newNote.trim(),
      authorId: user.uid,
      createdAt: serverTimestamp(),
    });

    setNewNote("");
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 Shared Notes</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a note..."
          value={newNote}
          onChangeText={setNewNote}
        />
        <Button title="Add" onPress={addNote} />
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteRow}>
            <Text style={styles.note}>
              {item.title}
            </Text>
            <Button title="Delete" onPress={() => deleteNote(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  inputRow: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginRight: 10 },
  noteRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
  note: { fontSize: 18 },
});
