import { HomeContext } from "@/app/context/homeContext";
import useHousehold from "@/app/context/householdContext";
import { auth, db } from "@/firebaseConfig";
import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { default as React, useContext, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { RecipeContext } from "../../context/recipeContext";
import availableTags from "../../utils/availableTags";
import ProgressBar from "./progressBar";

type Props = NativeStackScreenProps<any>;

export default function TagsPage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    const homeContext = useContext(HomeContext);
    if (!recipeContext && !homeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext || homeContext!;
    const { householdId } = useHousehold();
    const [category, setCategory] = useState(availableTags[0].category);
    const [tag, setTag] = useState(availableTags[0].tags[0]);

    const addTag = async () => {
        if (!category || !tag || newRecipe.tags.find(el => el.tags.includes(tag))) return;
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
        navigation.pop(5);
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
            imageUrl: newRecipe.imageUrl
        });
    };

    const editRecipe = async () => {
        const user = auth.currentUser;
        if (!user) return;
        navigation.pop(5);
        await updateDoc(doc(db, "recipes", newRecipe.id), {
            title: newRecipe.title.trim(),
            ingredients: newRecipe.ingredients ?? [],
            cookingTime: newRecipe.cookingTime ?? "0",
            portions: newRecipe.portions ?? "0",
            calories: newRecipe.calories ?? "0",
            preparationSteps: newRecipe.preparationSteps ?? [],
            notes: newRecipe.notes ?? [],
            tags: newRecipe.tags ?? [],
            imageUrl: newRecipe.imageUrl
        });
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.header}>Create a new recipe</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.pop(5)}><Ionicons name="close" size={24} /></TouchableOpacity>
            </View>
            <ProgressBar currentStep={4} />
            <View>
                <Text style={styles.textMedium}>Add Tag</Text>

                <Dropdown
                    style={styles.select}
                    data={availableTags.map(tag => ({
                        label: tag.category,
                        value: tag.category
                    }))}
                    labelField="label"
                    valueField="value"
                    value={category}
                    onChange={(item) => {
                        setCategory(item.value);
                        setTag(
                            availableTags.find(t => t.category === item.value)?.tags[0] ?? ""
                        );
                    }}
                />

                <Dropdown
                    style={styles.select}
                    data={
                        availableTags
                            .find(item => item.category === category)
                            ?.tags.map(tag => ({
                                label: tag,
                                value: tag
                            })) ?? []
                    }
                    labelField="label"
                    valueField="value"
                    value={tag}
                    onChange={(item) => setTag(item.value)}
                />
            </View>

            <TouchableOpacity
                style={styles.addIngredientButton}
                onPress={addTag}>
                <Text style={{ ...styles.textMedium, color: "white" }}>Add tag</Text>
            </TouchableOpacity>

                <FlatList
                    style={styles.scrollView}
                    data={newRecipe.tags}
                    keyExtractor={(item) => item.category}
                    renderItem={({ item }) => {
                        if (item.tags.length > 0) return (
                            <View style={{ ...styles.listRow, height: "auto" }}>
                                <Text style={{ fontSize: 14, alignSelf: "flex-start" }}>{item.category}:</Text>
                                <FlatList
                                    data={item.tags}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <View style={{ ...styles.listRow, height: 50 }}>
                                            <Text style={{ fontSize: 14, alignSelf: "center" }}>{item}</Text>
                                            <TouchableOpacity
                                                style={{...styles.roundDeleteButton, marginLeft:4, alignSelf: "center" }}
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

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={navigation.goBack}>
                    <Text style={styles.textMedium}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={newRecipe.id ? editRecipe : addRecipe}>
                    <Text style={styles.textNextButton}>Save</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}