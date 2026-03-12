import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, getDocs, query, serverTimestamp, where, writeBatch } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig";
import styles from "../../styles";
import { HomeContext } from "../context/homeContext";
import useHousehold from "../context/householdContext";
import { RecipeContext } from "../context/recipeContext";

type Props = NativeStackScreenProps<any>;
export default function RecipeView({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    const homeContext = useContext(HomeContext);
    if (!recipeContext && !homeContext) return null;
    const { newRecipe } = recipeContext || homeContext!;

    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const [portions, setPortions] = useState(Number(newRecipe.portions));
    const [addedToShoppingList, setAddedToShoppingList] = useState(false);
    const { householdId } = useHousehold();

    const deleteRecipe = async () => {
        navigation.goBack();
        const batch = writeBatch(db);
        batch.delete(doc(db, "recipes", newRecipe.id));
        const mealsSnap = await getDocs(
            query(
                collection(db, "meals"),
                where("recipeId", "==", newRecipe.id),
                where("householdId", "==", householdId)
            )
        );
        mealsSnap.forEach((meal) => {
            batch.delete(meal.ref);
        });

        await batch.commit();
    };

    const addToShoppingList = async () => {
        const batch = writeBatch(db);
        newRecipe.ingredients.forEach((ingredient) => {
            const groceryRef = doc(collection(db, "groceries"));
            batch.set(groceryRef, {
                title: ingredient.title,
                quantity: 1,
                householdId: householdId,
                storePref: "Other",
                createdAt: serverTimestamp(),
            });
        });
        setAddedToShoppingList(true);
        await batch.commit();
    }

    const infoBoxes = () => {
        return (
            <View style={styles.row}>
                <View style={styles.infoBox}>
                    <Ionicons name="stopwatch" size={24}></Ionicons>
                    <Text style={{ color: "gray" }}>Cooking time</Text>
                    <Text >{newRecipe.cookingTime} min</Text>
                </View>
                <View style={styles.infoBox}>
                    <Ionicons name="people" size={24}></Ionicons>
                    <Text style={{ color: "gray" }}>portions</Text>
                    <Text >{newRecipe.portions}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Ionicons name="flame" size={24}></Ionicons>
                    <Text style={{ color: "gray" }}>Calories</Text>
                    <Text >{newRecipe.calories} kcal</Text>
                </View>
            </View>
        )
    }

    const toggleCheckbox = (id: string) => {
        setCheckedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const ingredientView = () => {
        return newRecipe.ingredients.length > 0 && (
            <View style={styles.box}>
                <Text style={{ ...styles.title, marginTop: 0 }}>Ingredients ({newRecipe.ingredients.length})</Text>
                <View>
                    {newRecipe.ingredients.map((item) => (
                        <View style={styles.ingredientRow} key={item.title}>
                            <Pressable
                                style={styles.ingredientCheckbox}
                                onPress={() => toggleCheckbox(item.title)}
                            >
                                {checkedIds.includes(item.title) && (
                                    <View style={styles.smallCheckbox}>
                                        <Ionicons name="checkbox" size={28} />
                                    </View>
                                )}
                            </Pressable>

                            <View>
                                <Text style={{ fontSize: 16 }}>{item.title}</Text>
                                <Text style={{ fontSize: 12, color: "gray" }}>
                                    {Number(item.quantity) > 0 &&
                                        (Number(item.quantity) * portions) / Number(newRecipe.portions)}{" "}
                                    {item.unit}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{ ...styles.row, marginTop: 8 }}>
                    <View style={styles.quantityRow}>
                        <TouchableOpacity style={styles.quantityButton} onPress={() => setPortions(prev => Math.max(0, prev - 1))}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>−</Text>
                        </TouchableOpacity>

                        <View style={styles.valueBox}>
                            <Text style={{ fontSize: 18 }}>{portions}</Text>
                        </View>

                        <TouchableOpacity style={styles.quantityButton} onPress={() => setPortions(prev => prev + 1)}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.addToShoppingListButton, addedToShoppingList && { ...styles.addToShoppingListButton, backgroundColor: "gray" }]}
                        disabled={addedToShoppingList}
                        onPress={() => addToShoppingList()}>
                        {!addedToShoppingList
                            ? <Text style={styles.textNextButton}>Add to shopping list</Text>
                            : <Text style={styles.textNextButton}>Added to shopping ✅</Text>
                        }
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 12, color: "gray" }}>Portions</Text>
            </View>)
    }

    const preparationView = () => {
        return newRecipe.preparationSteps.length > 0 && (
            <View style={styles.box}>
                <Text style={{ ...styles.title, marginTop: 0 }}>Preparation</Text>
                <View>
                    {newRecipe.preparationSteps.map((item, index) => (
                        <View
                            key={index}
                            style={{ ...styles.row, justifyContent: "flex-start" }}
                        >
                            <View style={styles.roundStepCounter}>
                                <Text style={{ fontWeight: "600" }}>{index + 1}</Text>
                            </View>

                            <Text
                                style={{
                                    fontSize: 14,
                                    alignSelf: "flex-start",
                                    marginLeft: 8,
                                    marginBottom: 16,
                                }}
                            >
                                {item}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>)
    }

    const notesView = () => {
        return newRecipe.notes.length > 0 && (
            <View style={styles.box}>
                <Text style={{ ...styles.title, marginTop: 0 }}>Notes</Text>
                <View>
                    {newRecipe.notes.map((item, index) => (
                        <View style={styles.row} key={index}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    alignSelf: "flex-start",
                                    marginLeft: 8,
                                    marginBottom: 8,
                                }}
                            >
                                • {item}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>)
    }

    const tagsView = () => {
        const [expanded, setExpanded] = useState(true);
        let tagCount = 0;
        newRecipe.tags.map((item) => tagCount += item.tags.length)

        return tagCount > 0 && (
            <View style={styles.box}>
                <View style={styles.row}>
                    <Text style={{ ...styles.title, marginTop: 0 }}>Tags ({tagCount})</Text>
                    <Pressable
                        onPress={() => setExpanded(prev => !prev)}
                    >
                        <Ionicons
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={20}
                        />
                    </Pressable>
                </View>

                {expanded &&
                    newRecipe.tags.map((category) => {
                        if (category.tags.length === 0) return null;

                        return (
                            <View key={category.category}>
                                <View style={{ ...styles.row, justifyContent: "flex-start" }}>

                                    <Text style={{ fontSize: 14, marginRight: 16 }}>{category.category}:</Text>
                                    {category.tags.map((tag) => (
                                        <View style={{ ...styles.listRow, height: 48, backgroundColor: "#806752" }} key={tag}>
                                            <Text style={{ fontSize: 14, color: "white" }}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    })}
            </View>
        )
    }

    return (
        <ScrollView style={{ display: "flex" }} keyboardShouldPersistTaps="handled">
            <View style={{ backgroundColor: "#F4F6F7" }}>
                <ImageBackground source={{ uri: newRecipe.imageUrl || "" }} style={styles.viewRecipeImage}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.bigRoundButton} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={16} /></TouchableOpacity>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.bigRoundButton} onPress={() => navigation.navigate("titlePage")}><Ionicons name="pencil" size={16} /></TouchableOpacity>
                            <TouchableOpacity style={styles.bigRoundButton} onPress={() => deleteRecipe()}><Ionicons name="trash" size={16} /></TouchableOpacity>
                        </View>

                    </View>
                </ImageBackground>

                <TouchableOpacity style={{ ...styles.bigRoundButton, alignSelf: "flex-end", marginTop: -24, marginRight: 16 }}>
                    <Ionicons name="calendar" size={16} />
                </TouchableOpacity>

                <View style={{ ...styles.modalContainer, paddingHorizontal: 16, paddingVertical: 0 }}>
                    <Text style={{ ...styles.title, marginTop: 0 }}> {newRecipe.title} </Text>
                    {infoBoxes()}
                    {ingredientView()}
                    {preparationView()}
                    {notesView()}
                    {tagsView()}
                </View>
            </View>
        </ScrollView>
    )
}