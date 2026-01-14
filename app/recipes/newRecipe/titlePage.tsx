import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import ProgressBar from "../progressBar";
import { RecipeContext } from "./recipeContext";

type Props = NativeStackScreenProps<any>;

export default function TitlePage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    if (!recipeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext;

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const requiredFieldsFilled = newRecipe.title.trim().length > 0;

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.row}>
                    <Text style={styles.header}>Create a new recipe</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
                </View>
                <ProgressBar currentStep={0} />
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

                <Text style={styles.textMedium}> Cooking time (min)</Text>
                <TextInput
                    placeholder="23"
                    placeholderTextColor="gray"
                    value={newRecipe.cookingTime}
                    onChangeText={(text) => setNewRecipe({ ...newRecipe, cookingTime: text })}
                    style={styles.textInput} />

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

                <TouchableOpacity
                    style={[{ ...styles.addRecipeNextButton, backgroundColor: "gray" }, requiredFieldsFilled && styles.addRecipeNextButton]}
                    disabled={!requiredFieldsFilled}
                    onPress={() => navigation.navigate("ingredientsPage")}>
                    <Text style={styles.textNextButton}>Next</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}