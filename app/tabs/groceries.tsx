import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, ScrollView, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles/style";
import useHousehold from "../context/householdContext";
import defaultGroceries from "../helpers/grocerySuggestion";

export const stores = ["Default", "Netto", "Lidl", "Rema"];

export type Grocery = {
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
                const data = doc.data() as { title: string; householdId: string; storePref: string; createdAt?: any };
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
            storePref: selectedStore,
            createdAt: serverTimestamp(),
        });
    };

    const deleteGrocery = async (id: string) => {
        await deleteDoc(doc(db, "groceries", id));
    };

    const storeList = (storePref: string) => {
        const items = groceries.filter(grocery => grocery.storePref === storePref);
        if (items.length === 0) return;
        return (
            <View key={storePref}>
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
                <View style={styles.addGroceryButton}>
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
                                setNewGrocery(item.label);
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
