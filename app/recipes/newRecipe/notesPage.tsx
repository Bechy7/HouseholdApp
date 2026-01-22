import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import ProgressBar from "./progressBar";
import { RecipeContext } from "./recipeContext";

type Props = NativeStackScreenProps<any>;

export default function NotesPage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    if (!recipeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext;

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const [note, setNote] = useState("");

    const addNote = async () => {
        if (!note.trim() || newRecipe.notes.some((n) => n === note)) return;
        newRecipe.notes.push(note.trim());
        setNewRecipe({ ...newRecipe });
        setNote("");
    }

    const deleteNote = (description: string) => {
        setNewRecipe({
            ...newRecipe,
            notes: newRecipe.notes.filter((item) => item !== description),
        });
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.header}>Create a new recipe</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
            </View>
            <ProgressBar currentStep={3} />
            <View>
                <Text style={styles.textMedium}> Add note</Text>
                <TextInput
                    value={note}
                    onChangeText={(text) => setNote(text)}
                    placeholderTextColor="gray"
                    placeholder="Write note"
                    multiline
                    textAlignVertical="top"
                    style={{ ...styles.textInput, height: 120 }} />
            </View>

            <TouchableOpacity
                style={styles.addIngredientButton}
                onPress={addNote}>
                <Text style={{ ...styles.textMedium, color: "white" }}>Add note</Text>
            </TouchableOpacity>

            {newRecipe.notes.length > 0 && (
                <View style={{ paddingTop: 16 }}>
                    <Text style={styles.textMedium}> Added notes</Text>
                </View>
            )}
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View>
                    <FlatList
                        data={newRecipe.notes}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View style={styles.listRow}>
                                <Text style={{ fontSize: 14, alignSelf: "flex-start" }}>{item}</Text>
                                <TouchableOpacity
                                    style={styles.roundDeleteButton}
                                    onPress={() => deleteNote(item)}>
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
                    onPress={() => navigation.navigate("tagsPage")}>
                    <Text style={styles.textNextButton}>Next</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}