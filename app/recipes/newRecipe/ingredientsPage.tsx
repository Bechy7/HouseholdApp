import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../../firebaseConfig";
import styles from "../../../styles";
import useHousehold from "../../context/householdContext";
import { Ingredient } from "../../tabs/recipes";
import ProgressBar from "../progressBar";
import { RecipeContext } from "./recipeContext";

type Props = NativeStackScreenProps<any>;

export default function IngredientsPage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    if (!recipeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext;

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const [newIngredient, setNewIngredient] = useState<Ingredient>({ title: "", quantity: "", unit: "" });
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
            quantity: newIngredient.quantity,
            unit: newIngredient.unit,
        });
        setNewRecipe({ ...newRecipe });
        setNewIngredient({ title: "", quantity: "", unit: "", storePref: "" });
        console.log(newRecipe);
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
                        value={newIngredient.quantity?.toString()}
                        onChangeText={(text) => setNewIngredient({ ...newIngredient, quantity: text })}
                        style={{ ...styles.textInput, marginRight: 12 }} />
                    <TextInput
                        placeholder="Name of unit"
                        placeholderTextColor="gray"
                        value={newIngredient.unit}
                        onChangeText={(text) => setNewIngredient({ ...newIngredient, unit: text })}
                        style={styles.textInput} />
                </View>
                <TouchableOpacity
                    style={styles.addIngredientButton}
                    onPress={addIngredient}>
                    <Text style={{ ...styles.textMedium, color: "white" }}>Add ingredient</Text>
                </TouchableOpacity>

                {newRecipe.ingredients.length > 0 && (
                    <View style={{ paddingTop: 16 }}>
                        <Text style={styles.textMedium}> Added ingredients</Text>
                    </View>
                )}
                <View>
                    <FlatList
                        data={newRecipe.ingredients}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <View style={styles.ingredientRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>{item.title}</Text>
                                    <Text style={{ fontWeight: "light", fontSize: 12, color: "gray" }}>{item.quantity} {item.unit}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.roundDeleteButton}
                                    onPress={() => deleteIngredient(item.title)}>
                                    <Ionicons name="trash" size={16} />
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
                        onPress={() => navigation.navigate("titlePage")}>
                        <Text style={styles.textNextButton}>Next</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </View>
    )
}