import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import { Grocery, stores } from "../tabs/groceries";

export default function GroceryView({ grocery, onClose }: { grocery: Grocery; onClose: () => void }) {
    const { householdId } = useHousehold();
    const [quantity, setQuantity] = useState(grocery.quantity);
    const [newGrocery, setNewGrocery] = useState<Grocery>(grocery);
    const [selectedStore, setSelectedStore] = useState(grocery.storePref || "Other");
    const requiredFieldsFilled = newGrocery.title.trim().length > 0;

    const addGrocery = async () => {
        const user = auth.currentUser;
        if (!user || !newGrocery.title.trim()) return;

        onClose();
        await addDoc(collection(db, "groceries"), {
            title: newGrocery.title.trim(),
            quantity,
            householdId: householdId,
            storePref: selectedStore,
            createdAt: serverTimestamp(),
        });
    };

    const updateGrocery = async () => {
        const user = auth.currentUser;
        if (!user || !newGrocery.title.trim()) return;

        onClose();
        await updateDoc(doc(db, "groceries", grocery.id), {
            title: newGrocery.title.trim(),
            quantity,
            householdId: householdId,
            storePref: selectedStore,
            createdAt: serverTimestamp(),
        });
    };

    const storeList = (storePref: string) => {
        return (
            <View key={storePref}>
                <TouchableOpacity style={[styles.storeButton, selectedStore == storePref && { backgroundColor: "#806752" }]} onPress={() => setSelectedStore(storePref)}>
                    <Text style={[selectedStore == storePref && { color: "white" }]}>{storePref}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
            <Text style={{ ...styles.header, alignSelf: "center", marginBottom: 16 }}>Add item to the list</Text>
            <Text style={styles.textMedium}>Name *</Text>

            <TextInput
                style={styles.input}
                placeholder="Write name of the item"
                placeholderTextColor="gray"
                value={newGrocery.title}
                onChangeText={(text) => setNewGrocery({ ...newGrocery, title: text })}
            />

            <Text style={{ ...styles.textMedium, marginVertical: 8 }}>Quantity</Text>
            <View style={{ ...styles.quantityRow, alignSelf: "flex-start" }}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(prev => Math.max(1, prev - 1))}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>−</Text>
                </TouchableOpacity>

                <View style={styles.valueBox}>
                    <Text style={{ fontSize: 18 }}>{quantity}</Text>
                </View>

                <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(prev => prev + 1)}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>+</Text>
                </TouchableOpacity>
            </View>

            <Text style={{ ...styles.textMedium, marginVertical: 8 }}>Add store</Text>
            <View style={styles.row}>
                <>{stores.map((store) => storeList(store))}</>
            </View>

            {!grocery.title
                ?
                <TouchableOpacity
                    style={[{ ...styles.saveButton, backgroundColor: "gray" }, requiredFieldsFilled && styles.saveButton]}
                    disabled={!requiredFieldsFilled}
                    onPress={() => addGrocery()}>
                    <Text style={styles.textNextButton}>Add</Text>

                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={[{ ...styles.saveButton, backgroundColor: "gray" }, requiredFieldsFilled && styles.saveButton]}
                    disabled={!requiredFieldsFilled}
                    onPress={() => updateGrocery()}>
                    <Text style={styles.textNextButton}>Save</Text>
                </TouchableOpacity>
            }
        </View>
    );
}
