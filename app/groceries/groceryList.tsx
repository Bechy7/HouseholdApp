import { Ionicons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { default as React, useEffect, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import defaultGroceries from "../helpers/grocerySuggestion";
import { Grocery, stores } from "../tabs/groceries";
import GroceryView from "./groceryView";

export default function GroceryList() {
    const { householdId } = useHousehold();
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [grocery, setGrosery] = useState<Grocery>({ title: "", quantity: 1, id: "", householdId, storePref: "" });
    const [groceryModalVisible, setGroceryModalVisible] = useState(false);
    const [checkedIds, setCheckedIds] = useState<string[]>([]);

    useEffect(() => {
        const q = query(collection(db, "groceries"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groceriesData: Grocery[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; quantity: number, householdId: string; storePref: string; createdAt?: any };
                return {
                    id: doc.id,
                    householdId: data.householdId,
                    title: data.title,
                    quantity: data.quantity,
                    storePref: data.storePref,
                };
            });
            setGroceries(groceriesData);
        });

        return () => unsubscribe();
    }, []);

    const deleteGrocery = async (id: string) => {
        await deleteDoc(doc(db, "groceries", id));
    };

    const toggleCheckbox = (id: string) => {
        setCheckedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const storeList = (storePref: string) => {
        const items = groceries.filter(grocery => grocery.storePref === storePref);
        return items.length > 0 && (
            <View key={storePref}>
                <Text style={styles.title}>{storePref} ({items.length})</Text>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.listRow}>
                            <Pressable style={styles.ingredientCheckbox}
                                onPress={() => toggleCheckbox(item.title)}>
                                {checkedIds.includes(item.title) &&
                                    <View style={styles.inner}>
                                        <Ionicons name="checkbox" size={28}></Ionicons>
                                    </View>}
                            </Pressable>
                            <Text style={{ fontSize: 16 }}>
                                {defaultGroceries.find((s) => s.label.toLowerCase().includes(item.title.toLowerCase()))?.emoji || "🛒"} {item.title}
                            </Text>
                            <Text style={{ fontSize: 12, color:"gray" }}>
                                 {item.quantity}x
                            </Text>
                            <TouchableOpacity style={{...styles.addToCalenderButton, backgroundColor:"#806752"}} onPress={() => {
                                setGrosery(item)
                                setGroceryModalVisible(true)
                            }
                            }>
                                <Ionicons style={{color:"white"}} name="pencil" size={16} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{...styles.addToCalenderButton, backgroundColor:"#806752"}} onPress={() => deleteGrocery(item.id)}>
                                <Ionicons style={{color:"white"}} name="trash" size={16} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        )
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.header}>Shopping List ({groceries.length})</Text>
                <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                    setGrosery({ title: "", quantity: 1, id: "", householdId, storePref: "" })
                    setGroceryModalVisible(true);
                }}>
                    <Ionicons name="add" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <>{stores.map((store) => storeList(store))}</>
            </ScrollView>

            <Modal style={styles.modal}
                visible={groceryModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setGroceryModalVisible(false)}
            >
                <GroceryView grocery={grocery} onClose={() => setGroceryModalVisible(false)} />
            </Modal>
        </View>
    );
}
