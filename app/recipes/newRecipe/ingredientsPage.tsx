import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../../firebaseConfig";
import styles from "../../../styles";
import useHousehold from "../../context/householdContext";
import { Ingredient, Recipe } from "../../tabs/recipes";
import ProgressBar from "../progressBar";

type Props = NativeStackScreenProps<any>;

export default function IngredientsPage({ navigation }: Props) {
    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const [newRecipe, setNewRecipe] = useState<Recipe>({ id: "", title: "", ingredients: [], householdId: "" });
    const [newIngredient, setNewIngredient] = useState<Ingredient>({title: "", quantity: 0, unit: ""});
    const { householdId } = useHousehold();

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
        if (!newIngredient.title.trim()) return;
        newRecipe.ingredients.push({
            title: newIngredient.title.trim(),
            quantity: Number(newIngredient.quantity),
            unit: newIngredient.unit,
        });
        setNewRecipe({ ...newRecipe });
        setNewIngredient({title: "", quantity: 0, unit: "", storePref: ""});
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
                <ProgressBar currentStep={1} />
                <View>
                    <Text style={styles.textMedium}> Add ingredient</Text>
                    <TextInput
                        placeholder="Write name of the ingredient"
                        placeholderTextColor="gray"
                        value={newIngredient.title}
                        onChangeText={(text) => setNewIngredient({ ...newIngredient, title: text })}
                        style={styles.textInput} />
                </View>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Quantity"
                        placeholderTextColor="gray"
                        value={newRecipe.portions}
                        onChangeText={(text) => setNewIngredient({ ...newIngredient, quantity: Number(text) })}
                        style={{ ...styles.textInput, marginRight: 12 }} />
                    <TextInput
                        placeholder="Name of unit"
                        placeholderTextColor="gray"
                        value={newRecipe.calories}
                        onChangeText={(text) => setNewIngredient({ ...newIngredient, unit: text })}
                        style={styles.textInput} />
                </View>
                <TouchableOpacity
                    style={styles.addIngredientButton}
                    onPress={addIngredient}>
                    <Text style={{ ...styles.textMedium, color: "white" }}>Add ingredient</Text>
                </TouchableOpacity>


                <View>
                    <FlatList
                        data={newRecipe.ingredients}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <View style={styles.ingredientRow}>
                                <Text style={{ fontSize: 18 }}>{item.title}</Text>
                                <TouchableOpacity
                                    style={styles.addRecipeBackButton}
                                    onPress={() => deleteIngredient(item.title)}>
                                    <Ionicons name="trash" size={24} style={{ marginRight: 8 }} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.addRecipeBackButton}
                        onPress={navigation.goBack}>
                        <Text style={styles.textMedium}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ ...styles.addRecipeNextButton, backgroundColor: "#2289ffff" }}
                        onPress={() => navigation.navigate("Step2")}>
                        <Text style={styles.textNextButton}>Next</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </View>
    )
}