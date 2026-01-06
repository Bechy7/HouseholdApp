import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import React, { useState } from "react";
import { Button, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import { stores } from "../tabs/groceries";
import { Recipe } from "../tabs/recipes";

export default function RecipeView({ recipeData, onClose }: { recipeData: Recipe; onClose: () => void }) {
    const [selectedStore, setSelectedStore] = useState("Default");
    const [newRecipe, setNewRecipe] = useState<Recipe>(recipeData);
    const [newIngredient, setNewIngredient] = useState("");
    const { householdId } = useHousehold();
    const [descriptionHeight, setDescriptionHeight] = useState(100);


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
        onClose();
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
        onClose();
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
    }

    return (
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
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
                    <View style={{ margin: 3 }}>
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
                                <Text style={{ fontSize: 18 }}>{item.title}</Text>
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
                {newRecipe.title.trim() ? (
                    <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.addRecipeButtonDisabled} disabled={true} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}