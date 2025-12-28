import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";
import defaultGroceries from "../helpers/grocerySuggestion";

const stores = ["Default", "Netto", "Lidl", "Rema"];

type Grocery = {
    id: string;
    title: string;
    householdId: string;
    storePref: string;
};

export default function GroceriesPage() {
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [newGrocery, setNewGrocery] = useState("");
    const [selectedStore, setSelectedStore] = useState("Default");
    const { householdId } = useHousehold();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const filteredSuggestions = defaultGroceries.filter((item) =>
        item.label.toLowerCase().includes(newGrocery.toLowerCase())
    );

    useEffect(() => {
        const q = query(collection(db, "groceries"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groceriesData: Grocery[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; createdAt?: any, storePref: string };
                return {
                    id: doc.id,
                    title: data.title,
                    householdId: data.householdId,
                    storePref: data.storePref,
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
            storePref: selectedStore,
        });

    };

    const deleteGrocery = async (id: string) => {
        await deleteDoc(doc(db, "groceries", id));
    };

    const storeList = (storePref: string) => {
        const items = groceries.filter(grocery => grocery.storePref === storePref);
        if (items.length === 0) return;
        return (
            <View>
                <Text style={styles.storeTitle}>{storePref}</Text>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.groceryRow}>
                            <Text style={styles.grocery}>
                                {defaultGroceries.find((s) => s.label === item.title)?.emoji || "🛒"} {item.title}
                            </Text>
                            <Button title="Delete" onPress={() => deleteGrocery(item.id)} />
                        </View>
                    )}
                />
            </View>

        )
    }

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
                <select style={styles.select} value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                    {stores.map((store) => (
                        <option key={store} value={store}>{store}</option>
                    ))}
                </select>
                <View style={styles.addButton}>
                    <Button title="Add" onPress={() => addGrocery(newGrocery)} />
                </View>
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
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <>{stores.map((store) => storeList(store))}</>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    addButton: { margin: 3 },
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    inputRow: { flexDirection: "row", marginBottom: 20 },
    input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginRight: 10 },
    groceryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
    grocery: { fontSize: 18 },
    scrollView: { paddingRight: 10 },
    select: { width: 75, marginRight: 10 },
    storeTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
    suggestions: { backgroundColor: "#f5f5f5", borderRadius: 8, padding: 10, marginBottom: 10, },
    suggestion: { paddingVertical: 8, fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#ddd", },
});
