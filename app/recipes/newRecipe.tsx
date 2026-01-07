import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import { Recipe } from "../tabs/recipes";
import ProgressBar from "./progressBar";

const cookingTimes = ["min", "hours"];

export default function newRecipe({ onClose }: { onClose: () => void }) {
    const [selectedStore, setSelectedStore] = useState("Default");
    const [newRecipe, setNewRecipe] = useState<Recipe>({ id: "", title: "", ingredients: [], householdId: "" });
    const [newIngredient, setNewIngredient] = useState("");
    const { householdId } = useHousehold();
    const [descriptionHeight, setDescriptionHeight] = useState(100);
    const requiredFieldsFilled = newRecipe.title.trim().length > 0;
    const [currentStep, setCurrentStep] = useState(0);

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

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.row}>
                    <Text style={styles.header}>Create a new recipe</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
                </View>
                <ProgressBar currentStep={currentStep} />
                <View>
                    <Text style={styles.textMedium}> Name of the recipe</Text>
                    <Image
                        source={{ uri: "" }}
                        style={styles.addRecipeImage} />
                </View>
                <View>
                    <Text style={styles.textMedium}> Name of the recipe *</Text>
                    <TextInput
                        placeholder="Write name of the recipe"
                        placeholderTextColor="gray"
                        value={newRecipe.title}
                        onChangeText={(text) => setNewRecipe({ ...newRecipe, title: text })}
                        style={styles.textInput} />
                </View>

                <Text style={styles.textMedium}> Cooking time</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="23"
                        placeholderTextColor="gray"
                        value={newRecipe.cookingTime}
                        onChangeText={(text) => setNewRecipe({ ...newRecipe, cookingTime: text })}
                        style={styles.textInput} />
                    <select style={styles.select} value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                        {cookingTimes.map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </View>

                <View style={styles.inputRow}>
                    <Text style={{ ...styles.textMedium, flex: 1, marginRight: 12 }}> Portions</Text>
                    <Text style={{ ...styles.textMedium, flex: 1 }}> Calories</Text>
                </View>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="4"
                        placeholderTextColor="gray"
                        value={newRecipe.portions}
                        onChangeText={(text) => setNewRecipe({ ...newRecipe, portions: text })}
                        style={{ ...styles.textInput, marginRight: 12 }} />
                    <TextInput
                        placeholder="550"
                        placeholderTextColor="gray"
                        value={newRecipe.calories}
                        onChangeText={(text) => setNewRecipe({ ...newRecipe, calories: text })}
                        style={styles.textInput} />
                </View>


                {/* <View>
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
                </View> */}

                <TouchableOpacity
                    style={[styles.addRecipeNextButtonDisabled, requiredFieldsFilled && styles.addRecipeNextButtonEnabled]}
                    disabled={!requiredFieldsFilled}
                    onPress={() => {setCurrentStep(currentStep + 1)}}><Text>Next</Text></TouchableOpacity>

            </ScrollView>
        </View>
    )
}