import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function NotesScreen() {
  const [notes, setNotes] = useState<{ id: string; title: string; author: string }[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; title: string; author: string }[];
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, []);

  const addNote = async () => {
    if (!newNote.trim()) return;
    await addDoc(collection(db, "notes"), {
      title: newNote,
      createdAt: new Date(),
      author: auth.currentUser?.email,
    });
    setNewNote("");
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const currentUserEmail = auth.currentUser?.email;

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />

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
              {item.author ? `${item.author}: ` : ""}• {item.title}
            </Text>
            {item.author === currentUserEmail && (
              <Button title="Delete" onPress={() => deleteNote(item.id)} />
            )}
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
  noteRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  note: { fontSize: 18, paddingVertical: 5 },
});
