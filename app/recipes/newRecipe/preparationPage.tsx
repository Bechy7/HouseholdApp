import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import ProgressBar from "../progressBar";
import { RecipeContext } from "./recipeContext";

type Props = NativeStackScreenProps<any>;

export default function PreparationPage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    if (!recipeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext;

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const [preparationStep, setPreparationStep] = useState("");

    const addPreparationStep = async () => {
        if (!preparationStep.trim()) return;
        newRecipe.preparationSteps.push(preparationStep.trim());
        setNewRecipe({ ...newRecipe });
        setPreparationStep("");
    }

    const deletePreparationStep = (description: string) => {
        setNewRecipe({
            ...newRecipe,
            preparationSteps: newRecipe.preparationSteps.filter((item) => item !== description),
        });
    };

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.row}>
                    <Text style={styles.header}>Create a new recipe</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
                </View>
                <ProgressBar currentStep={2} />
                <View>
                    <Text style={styles.textMedium}> Add preparation step</Text>
                    <TextInput
                        value={preparationStep}
                        onChangeText={(text) => setPreparationStep(text)}
                        placeholderTextColor="gray"
                        placeholder="Write step"
                        multiline
                        textAlignVertical="top"
                        style={{ ...styles.textInput, height: 120 }} />
                </View>

                <TouchableOpacity
                    style={styles.addIngredientButton}
                    onPress={addPreparationStep}>
                    <Text style={{ ...styles.textMedium, color: "white" }}>Add step</Text>
                </TouchableOpacity>

                {newRecipe.preparationSteps.length > 0 && (
                    <View style={{ paddingTop: 16 }}>
                        <Text style={styles.textMedium}> Added preparation steps</Text>
                    </View>
                )}
                <View>
                    <FlatList
                        data={newRecipe.preparationSteps}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View style={styles.listRow}>
                                <View style={styles.roundStepCounter}>
                                    <Text style={{ fontWeight: "600" }}>{newRecipe.preparationSteps.indexOf(item) + 1}</Text>
                                </View>
                                <Text style={{ fontSize: 14, alignSelf: "flex-start" }}>{item}</Text>
                                <TouchableOpacity
                                    style={styles.roundDeleteButton}
                                    onPress={() => deletePreparationStep(item)}>
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