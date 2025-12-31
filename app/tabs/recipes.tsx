import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles/style";
import useHousehold from "../context/householdContext";
import { stores } from "./groceries";

type Recipe = {
    id: string;
    title: string;
    householdId: string;
    ingredients: { title: string; storePref: string }[];
    description?: string;
};

export default function RecipesPage() {
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [newRecipe, setNewRecipe] = useState<Recipe>({ id: "", title: "", householdId: "", ingredients: [] });
    const [newIngredient, setNewIngredient] = useState("");
    const [selectedStore, setSelectedStore] = useState("Default");
    const [descriptionHeight, setDescriptionHeight] = useState(100);
    const { householdId } = useHousehold();

    useEffect(() => {
        const q = query(collection(db, "recipes"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipesData: Recipe[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; ingredients: { title: string; storePref: string }[]; description: string; createdAt?: any };
                return {
                    id: doc.id,
                    title: data.title,
                    householdId: data.householdId,
                    ingredients: data.ingredients,
                    description: data.description,
                };
            });
            setRecipes(recipesData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [toastMessage]);

    const addRecipe = async () => {
        const user = auth.currentUser;
        if (!user || !newRecipe.title.trim()) return;
        await addDoc(collection(db, "recipes"), {
            title: newRecipe.title.trim(),
            householdId,
            ingredients: newRecipe.ingredients,
            description: newRecipe.description || "",
            createdAt: serverTimestamp(),
        });
        setModalVisible(false);
    };

    const deleteRecipe = async (id: string) => {
        await deleteDoc(doc(db, "recipes", id));
    };

    const updateRecipe = async () => {
        await updateDoc(doc(db, "recipes", newRecipe.id), {
            title: newRecipe.title.trim(),
            ingredients: newRecipe.ingredients,
            description: newRecipe.description || "",
        });
        setToastMessage(`${newRecipe.title} updated successfully!`);
        setModalVisible(false);
    };

    const addIngredient = async () => {
        if (!newIngredient.trim()) return;
        newRecipe.ingredients.push({
            title: newIngredient.trim(),
            storePref: selectedStore,
        });
        setNewRecipe({ ...newRecipe });
        setNewIngredient("");
    }

    const deleteIngredient = (title: string) => {
        setNewRecipe({
            ...newRecipe,
            ingredients: newRecipe.ingredients.filter((item) => item.title !== title),
        });
    };

    const addToGroceryList = async () => {
        const batch = writeBatch(db);
        newRecipe.ingredients.forEach((ingredient) => {
            const groceryRef = doc(collection(db, "groceries"));
            batch.set(groceryRef, {
                title: ingredient.title,
                householdId: householdId,
                storePref: ingredient.storePref,
                createdAt: serverTimestamp(),
            });
        });
        await batch.commit();
        setToastMessage("Added ingredients to grocery list!");
    }

    return (
        <View style={styles.container}>
            {toastMessage && (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </View>
            )}
            <View style={styles.one_row}>
                <Text style={styles.header}>Recipes</Text>
                <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                    setNewRecipe({ id: "", title: "", householdId: "", ingredients: [] });
                    setModalVisible(true)
                    setShouldUpdate(false);
                }}><Ionicons name="add" size={24} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <FlatList
                    data={recipes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.recipeRow}>
                            <TouchableOpacity style={styles.recipeRow} onPress={() => {
                                setNewRecipe(item);
                                setModalVisible(true);
                                setShouldUpdate(true);
                            }}>
                                <Text style={styles.recipe}>{item.title}</Text>
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
                        {toastMessage && (
                            <View style={styles.toast}>
                                <Text style={styles.toastText}>{toastMessage}</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} /></TouchableOpacity>
                        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                            <TextInput
                                placeholder="Enter recipe name"
                                value={newRecipe.title}
                                onChangeText={(text) => setNewRecipe({ ...newRecipe, title: text })}
                                style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 }} />
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter ingredient name"
                                    value={newIngredient}
                                    onChangeText={setNewIngredient}
                                />
                                <select style={styles.select} value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                                    {stores.map((store) => (
                                        <option key={store} value={store}>{store}</option>
                                    ))}
                                </select>
                                <View style={styles.addIngredientButton}>
                                    <Button title="Add" onPress={() => addIngredient()} />
                                </View>
                            </View>
                            <Text style={styles.title}>Ingredients</Text>
                            <View>
                                <FlatList
                                    data={newRecipe.ingredients}
                                    keyExtractor={(item) => item.title}
                                    renderItem={({ item }) => (
                                        <View style={styles.ingredientRow}>
                                            <Text style={styles.ingredient}>{item.title}</Text>
                                            <Button title="Delete" onPress={() => deleteIngredient(item.title)} />
                                        </View>
                                    )}
                                />
                            </View>
                            <Text style={styles.title}>Description</Text>
                            <TextInput
                                value={newRecipe.description}
                                onChangeText={(text) => setNewRecipe({ ...newRecipe, description: text })}
                                placeholder="Add a description"
                                multiline
                                textAlignVertical="top"
                                scrollEnabled={false}
                                onContentSizeChange={(e) => {
                                    setDescriptionHeight(Math.max(100, e.nativeEvent.contentSize.height))
                                }
                                }
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    borderRadius: 8,
                                    padding: 12,
                                    height: descriptionHeight,
                                    overflow: "hidden",
                                    marginBottom: 16,
                                    fontSize: 16,
                                    backgroundColor: "#fff",
                                }} />
                            {newRecipe.title.trim() && !shouldUpdate ? (
                                <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                            ) : !shouldUpdate ? (
                                <TouchableOpacity style={styles.addRecipeButtonDisabled} disabled={true} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                            ) : (
                                <View>
                                    <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={updateRecipe}><Text>Update recipe</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={addToGroceryList}><Text>Add Ingredients to Grocery List</Text></TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </Modal>
            </ScrollView>
        </View>


    )
}


