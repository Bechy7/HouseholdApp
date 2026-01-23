import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import { RecipeContext } from "../../context/recipeContext";
import { Ingredient } from "../../tabs/recipes";
import ProgressBar from "./progressBar";

type Props = NativeStackScreenProps<any>;

export default function IngredientsPage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    if (!recipeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext;

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const [newIngredient, setNewIngredient] = useState<Ingredient>({ title: "", quantity: "", unit: "" });

    const addIngredient = async () => {
        if (!newIngredient.title.trim() || newRecipe.ingredients.some((ingredient) => ingredient.title === newIngredient.title)) return;
        newRecipe.ingredients.push({
            title: newIngredient.title.trim(),
            quantity: newIngredient.quantity,
            unit: newIngredient.unit,
        });
        setNewRecipe({ ...newRecipe });
        setNewIngredient({ title: "", quantity: "", unit: "", storePref: "" });
    }

    const deleteIngredient = (title: string) => {
        setNewRecipe({
            ...newRecipe,
            ingredients: newRecipe.ingredients.filter((item) => item.title !== title),
        });
    };

    return (
        <View style={styles.modalContainer}>
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
                    keyboardType="numeric"
                    value={newIngredient.quantity}
                    onChangeText={(text) => {
                        const filteredText = text.replace(/[^0-9.]/g, "");
                        setNewIngredient({ ...newIngredient, quantity: filteredText })
                    }}
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
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View>
                    <FlatList
                        data={newRecipe.ingredients}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <View style={styles.listRow}>
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
            </ScrollView>

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={navigation.goBack}>
                    <Text style={styles.textMedium}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => navigation.navigate("preparationPage")}>
                    <Text style={styles.textNextButton}>Next</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}