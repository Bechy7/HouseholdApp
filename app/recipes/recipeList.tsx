import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import EmptyBox from "../images/emptyBox.png";
import { emptyRecipeData, Recipe, Tag } from "../tabs/recipes";
import sortOptions, { sortMethod } from "../utils/sortOptions";
import NewRecipe from "./newRecipe";
import RecipeView from "./recipeView";

export default function RecipeList() {
    const [addRecipeModalVisible, setAddRecipeModalVisible] = useState(false);
    const [viewRecipeModalVisible, setViewRecipeModalVisible] = useState(false);
    const [recipeData, setRecipeData] = useState<Recipe>(emptyRecipeData);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [searchRecipe, setSearchRecipe] = useState("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchRecipe.toLowerCase())
    );
    const { householdId } = useHousehold();

    useEffect(() => {
        const q = query(collection(db, "recipes"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipesData: Recipe[] = snapshot.docs.map((doc) => {
                const data = doc.data() as {
                    createdAt?: any;
                    title: string;
                    householdId: string;
                    ingredients?: {
                        title: string;
                        storePref?: string,
                        quantity?: string,
                        unit?: string
                    }[];
                    cookingTime?: string;
                    portions?: string;
                    calories?: string;
                    preparationSteps?: string[];
                    notes?: string[];
                    tags?: Tag[]
                };
                return {
                    id: doc.id,
                    createdAt: data.createdAt,
                    title: data.title,
                    householdId: data.householdId,
                    ingredients: data.ingredients ?? [],
                    cookingTime: data.cookingTime ?? "0",
                    portions: data.portions ?? "0",
                    calories: data.calories ?? "0",
                    preparationSteps: data.preparationSteps ?? [],
                    notes: data.notes ?? [],
                    tags: data.tags ?? []
                };
            });
            setRecipes(recipesData);
        });

        return () => unsubscribe();
    }, []);

    const addMeal = async (recipe: Recipe) => {
            const user = auth.currentUser;
            if (!user) return;
            await addDoc(collection(db, "meals"), {
                createdAt: serverTimestamp(),
                recipeId: recipe.id,
                title: recipe.title,
                cookingTime: recipe.cookingTime,
                householdId: recipe.householdId,
                date: Timestamp.now()
            });
        }

    const sortAndFilterButtons = () => {
        return (
            <View style={styles.sortAndFilterRow}>
                <TouchableOpacity style={styles.sortAndFilterButton} onPress={() => {
                    setSortModalVisible(true)
                }}>
                    <Ionicons name="arrow-up" size={24} style={{ marginRight: 8 }} />
                    <Text>sort</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortAndFilterButton} onPress={() => {
                    setFilterModalVisible(true)
                }}>
                    <Ionicons name="filter" size={24} style={{ marginRight: 8 }} />
                    <Text>filter</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const sortingModal = () => {
        return (
            <Modal style={styles.modal}
                visible={sortModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <TouchableOpacity style={{ width: "100%", height: "100%" }} onPress={() => setSortModalVisible(false)}></TouchableOpacity>
                    <View style={styles.sortContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSortModalVisible(false)}><Ionicons name="close" size={24} /></TouchableOpacity>
                        <Text style={styles.sortTitle}>Sort by</Text>
                        <FlatList
                            data={sortOptions}
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.sortRow} onPress={() => {
                                    setRecipes(sortMethod(item.title, recipes) || recipes);
                                    setSortModalVisible(false);
                                }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View style={styles.checkbox} />
                                        <Text style={{ fontSize: 16 }}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}>
                        </FlatList>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.modalContainer}>
                {sortModalVisible && (
                    <div style={styles.blurredBackground} />
                )}
                <View style={styles.container}>
                    <View style={styles.row}>
                        <Text style={styles.header}>All recipes</Text>
                        <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                            setAddRecipeModalVisible(true);
                        }}>
                            <Ionicons name="add" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchRecipe}>
                        <Ionicons name="search" size={18} style={{ alignContent: "center" }} />
                        <TextInput
                            style={{ paddingLeft: 8, flex: 1 }}
                            placeholder="Search here"
                            placeholderTextColor={"gray"}
                            value={searchRecipe}
                            onChangeText={setSearchRecipe}>
                        </TextInput>
                    </View>

                    {sortAndFilterButtons()}

                    <FlatList
                        data={filteredRecipes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.recipeRow} onPress={() => {
                                setRecipeData(item);
                                setViewRecipeModalVisible(true);
                            }}>
                                <Image
                                    source={{ uri: "" }}
                                    style={styles.RecipeListImage} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, marginTop: 16, marginBottom: 8 }}>{item.title}</Text>
                                    <Ionicons name="stopwatch" size={16} style={{ marginBottom: 16 }}>
                                        <Text style={{ marginLeft: 4, fontWeight: "light", fontSize: 12 }}>{item.cookingTime || "0"} min</Text>
                                    </Ionicons>
                                </View>
                                <TouchableOpacity style={styles.addToCalenderButton} onPress={() => addMeal(item)}>
                                    <Ionicons name="calendar" size={16} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}>
                    </FlatList>

                    {recipes.length == 0 && (
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Image source={EmptyBox} style={{ marginBottom: 48 }} />
                            <Text style={styles.textMedium}> No recipes yet</Text>
                            <Text> Start by adding a recipe</Text>
                            <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                                setAddRecipeModalVisible(true);
                            }}>
                                <Ionicons name="add" size={24} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Add Recipe Modal */}
                <Modal style={styles.modal}
                    visible={addRecipeModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setAddRecipeModalVisible(false)}
                >
                    <NewRecipe recipe={emptyRecipeData} onClose={() => setAddRecipeModalVisible(false)} />
                </Modal>

                {/* View Recipe Modal */}
                <Modal style={styles.modal}
                    visible={viewRecipeModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setViewRecipeModalVisible(false)}
                >
                    <RecipeView recipe={recipeData} onClose={() => setViewRecipeModalVisible(false)} />
                </Modal>

                {sortingModal()}
            </View>
        </ScrollView>
    )
}



