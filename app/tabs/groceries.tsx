import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";

const DEFAULT_SUGGESTIONS = [
  { label: "Milk", emoji: "🥛" },
  { label: "Eggs", emoji: "🥚" },
  { label: "Apples", emoji: "🍎" },
  { label: "Bananas", emoji: "🍌" },
  { label: "Bread", emoji: "🍞" },
  { label: "Butter", emoji: "🧈" },
  { label: "Cheese", emoji: "🧀" },
  { label: "Tomatoes", emoji: "🍅" },
];


type Grocery = {
    id: string;
    title: string;
    householdId: string;
};

export default function GroceriesPage() {
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [newGrocery, setNewGrocery] = useState("");
    const { householdId } = useHousehold();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const filteredSuggestions = DEFAULT_SUGGESTIONS.filter((item) =>
        item.label.toLowerCase().includes(newGrocery.toLowerCase())
    );

    useEffect(() => {
        // Listen to all groceries, ordered by createdAt
        const q = query(collection(db, "groceries"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groceriesData: Grocery[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; createdAt?: any };
                return {
                    id: doc.id,
                    title: data.title,
                    householdId: data.householdId,
                };
            });
            setGroceries(groceriesData);
        });

        return () => unsubscribe();
    }, []);

    const addGrocery = async (item: string) => {
        setNewGrocery("");
        const user = auth.currentUser;
        if (!user || !item.trim()) return;

        await addDoc(collection(db, "groceries"), {
            title: item.trim(),
            householdId: householdId,
            createdAt: serverTimestamp(),
        });

    };

    const deleteGrocery = async (id: string) => {
        await deleteDoc(doc(db, "groceries", id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📝 Shared Groceries</Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a grocery..."
                    value={newGrocery}
                    onChangeText={setNewGrocery}
                    onFocus={() => setShowSuggestions(true)}
                />
                <Button title="Add" onPress={() => addGrocery(newGrocery)} />
            </View>

            {showSuggestions && filteredSuggestions.length > 0 && newGrocery.length > 0 && (
                <View style={styles.suggestions}>
                    {filteredSuggestions.map((item) => (
                        <Text
                            key={item.label}
                            style={styles.suggestion}
                            onPress={() => {
                                addGrocery(item.label);
                                setShowSuggestions(false);
                            }}
                        >
                            {item.emoji} {item.label}
                        </Text>
                    ))}
                </View>
            )}

            <FlatList
                data={groceries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.groceryRow}>
                        <Text style={styles.grocery}>
                            {DEFAULT_SUGGESTIONS.find((s) => s.label === item.title)?.emoji || "🛒"} {item.title}
                        </Text>
                        <Button title="Delete" onPress={() => deleteGrocery(item.id)} />
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
    groceryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
    grocery: { fontSize: 18 },
    suggestions: { backgroundColor: "#f5f5f5", borderRadius: 8, padding: 10, marginBottom: 10, },
    suggestion: { paddingVertical: 8, fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#ddd", },
});
