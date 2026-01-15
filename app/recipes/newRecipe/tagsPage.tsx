import useHousehold from "@/app/context/householdContext";
import { auth, db } from "@/firebaseConfig";
import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { default as React, useContext, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import availableTags from "../../helpers/availableTags";
import ProgressBar from "../progressBar";
import { RecipeContext } from "./recipeContext";

type Props = NativeStackScreenProps<any>;

export default function TagsPage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    if (!recipeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext;
    const { householdId } = useHousehold();
    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const [category, setCategory] = useState(availableTags[0].category);
    const [tag, setTag] = useState(availableTags[0].tags[0]);

    const addTag = async () => {
        if (!category || !tag || newRecipe.tags.find(el => el.tags[0] === tag)) return;
        const connectedCategory = newRecipe.tags.find((item) => item.category === category);
        if (connectedCategory) {
            connectedCategory.tags.push(tag);
        }
        setNewRecipe({ ...newRecipe });
    }

    const deleteTag = (tagToDelete: string) => {
        setNewRecipe({
            ...newRecipe,
            tags: newRecipe.tags.map(tagGroup => ({
                ...tagGroup,
                tags: tagGroup.tags.filter(tag => tag !== tagToDelete),
            })),
        });
    };

    const addRecipe = async () => {
        const user = auth.currentUser;
        if (!user) return;
        await addDoc(collection(db, "recipes"), {
            createdAt: serverTimestamp(),
            title: newRecipe.title.trim(),
            householdId,
            ingredients: newRecipe.ingredients ?? [],
            cookingTime: newRecipe.cookingTime ?? "0",
            portions: newRecipe.portions ?? "0",
            calories: newRecipe.calories ?? "0",
            preparationSteps: newRecipe.preparationSteps ?? [],
            notes: newRecipe.notes ?? [],
            tags: newRecipe.tags ?? [],
        });
        onClose();
    };

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.row}>
                    <Text style={styles.header}>Create a new recipe</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
                </View>
                <ProgressBar currentStep={4} />
                <View>
                    <Text style={styles.textMedium}> Add Tag</Text>
                    <select style={styles.select} value={category} onChange={(e) => { setCategory(e.target.value), setTag(availableTags.find((t) => t.category === e.target.value)?.tags[0] ?? "") }}>
                        {availableTags.map((tag) => (
                            <option key={tag.category} value={tag.category}>{tag.category}</option>
                        ))}
                    </select>
                    <select style={styles.select} value={tag} onChange={(e) => setTag(e.target.value)}>
                        {availableTags.find((item) => item.category === category)?.tags.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </View>

                <TouchableOpacity
                    style={styles.addIngredientButton}
                    onPress={addTag}>
                    <Text style={{ ...styles.textMedium, color: "white" }}>Add tag</Text>
                </TouchableOpacity>

                <View>
                    <FlatList
                        data={newRecipe.tags}
                        keyExtractor={(item) => item.category}
                        renderItem={({ item }) => {
                            if (item.tags.length > 0) return (
                                <View style={styles.listRow}>
                                    <Text style={{ fontSize: 14, alignSelf: "flex-start" }}>{item.category}:</Text>
                                    <FlatList
                                        data={item.tags}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <View style={styles.listRow}>
                                                <Text style={{ fontSize: 14, alignSelf: "flex-start" }}>{item}</Text>
                                                <TouchableOpacity
                                                    style={styles.roundDeleteButton}
                                                    onPress={() => deleteTag(item)}>
                                                    <Ionicons name="trash" size={16} />
                                                </TouchableOpacity>
                                            </View>
                                        )}>
                                    </FlatList>
                                </View>
                            )
                            return (<></>)
                        }}
                    />
                </View>

                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.addRecipeBackButton}
                        onPress={navigation.goBack}>
                        <Text style={styles.textMedium}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.addRecipeNextButton}
                        onPress={addRecipe}>
                        <Text style={styles.textNextButton}>Save</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </View>
    )
}