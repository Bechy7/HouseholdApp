import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles/style";
import useHousehold from "../context/householdContext";
import { stores } from "./groceries";

type Recipe = {
    id: string;
    title: string;
    householdId: string;
    groceries: { title: string; storePref: string }[];
};

export default function RecipesPage() {
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [newRecipe, setNewRecipe] = useState<Recipe>({ id: "", title: "", householdId: "", groceries: [] });
    const [newGrocery, setNewGrocery] = useState("");
    const [selectedStore, setSelectedStore] = useState("Default");
    const { householdId } = useHousehold();

    useEffect(() => {
        const q = query(collection(db, "recipes"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipesData: Recipe[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; groceries: { title: string; storePref: string }[]; createdAt?: any };
                return {
                    id: doc.id,
                    title: data.title,
                    householdId: data.householdId,
                    groceries: data.groceries,
                };
            });
            console.log("Fetched recipes:", recipesData);
            setRecipes(recipesData);
        });

        return () => unsubscribe();
    }, []);

    const addRecipe = async () => {
        const user = auth.currentUser;
        if (!user || !newRecipe.title.trim()) return;
        await addDoc(collection(db, "recipes"), {
            title: newRecipe.title.trim(),
            householdId,
            groceries: newRecipe.groceries,
            createdAt: serverTimestamp(),
        });

        setModalVisible(false);
        setNewRecipe({ id: "", title: "", householdId: "", groceries: [] });
    };

    const deleteRecipe = async (id: string) => {
        await deleteDoc(doc(db, "recipes", id));
    };

    const updateRecipe = async () => {
        await updateDoc(doc(db, "recipes", newRecipe.id), {
            title: newRecipe.title.trim(),
            groceries: newRecipe.groceries,
        });
        setModalVisible(false);
        setNewRecipe({ id: "", title: "", householdId: "", groceries: [] });
    };

    const addGrocery = async () => {
        newRecipe.groceries.push({
            title: newGrocery.trim(),
            storePref: selectedStore,
        });
        setNewRecipe({ ...newRecipe });
        setNewGrocery("");
    }

    const deleteGrocery = (title: string) => {
        setNewRecipe({
            ...newRecipe,
            groceries: newRecipe.groceries.filter((item) => item.title !== title),
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.one_row}>
                <Text style={styles.header}>Recipes</Text>
                <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                    setNewRecipe({ id: "", title: "", householdId: "", groceries: [] });
                    setModalVisible(true)
                    setShouldUpdate(false);
                }}><Ionicons name="add" size={24} /></TouchableOpacity>
            </View>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.noteRow}>
                        <TouchableOpacity style={styles.noteRow} onPress={() => {
                            setNewRecipe(item);
                            setModalVisible(true);
                            setShouldUpdate(true);
                        }}>
                            <Text style={styles.note}>{item.title}</Text>
                        </TouchableOpacity>
                        <Button title="Delete" onPress={() => deleteRecipe(item.id)} />
                    </View>
                )}>

            </FlatList>
            <Modal style={styles.modal}
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal_container}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} /></TouchableOpacity>
                    <TextInput
                        placeholder="Enter recipe name"
                        value={newRecipe.title}
                        onChangeText={(text) => setNewRecipe({ ...newRecipe, title: text })}
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 }} />
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a grocery..."
                            value={newGrocery}
                            onChangeText={setNewGrocery}
                        />
                        <select style={styles.select} value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                            {stores.map((store) => (
                                <option key={store} value={store}>{store}</option>
                            ))}
                        </select>
                        <View style={styles.addGroceryButton}>
                            <Button title="Add" onPress={() => addGrocery()} />
                        </View>
                    </View>
                    <View>
                        <FlatList
                            data={newRecipe.groceries}
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <View style={styles.groceryRow}>
                                    <Text style={styles.grocery}>{item.title}</Text>
                                    <Button title="Delete" onPress={() => deleteGrocery(item.title)} />
                                </View>
                            )}
                        />
                    </View>
                    {newRecipe.title.trim() && !shouldUpdate ? (
                        <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                    ) : !shouldUpdate ? (
                        <TouchableOpacity style={styles.addRecipeButtonDisabled} disabled={true} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={updateRecipe}><Text>Update recipe</Text></TouchableOpacity>
                    )}
                </View>
            </Modal>
        </View>


    )
}


