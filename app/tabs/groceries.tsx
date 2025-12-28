import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";

type Grocery = {
    id: string;
    title: string;
    householdId: string;
};

export default function GroceriesPage() {
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [newGrocery, setNewGrocery] = useState("");
    const { householdId } = useHousehold();

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

    const addGrocery = async () => {
        const user = auth.currentUser;
        if (!user || !newGrocery.trim()) return;

        await addDoc(collection(db, "groceries"), {
            title: newGrocery.trim(),
            householdId: householdId,
            createdAt: serverTimestamp(),
        });

        setNewGrocery("");
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
                />
                <Button title="Add" onPress={addGrocery} />
            </View>

            <FlatList
                data={groceries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.groceryRow}>
                        <Text style={styles.grocery}>
                            {item.title}
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
});
