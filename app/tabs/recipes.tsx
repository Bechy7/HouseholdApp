import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import sortOptions, { sortMethod } from "../helpers/sortOptions";
import { stores } from "./groceries";

export type Recipe = {
    id: string;
    createdAt?: any;
    title: string;
    householdId: string;
    ingredients: { title: string; storePref: string }[];
    description?: string;
};

export default function RecipesPage() {
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [addRecipeModalVisible, setAddRecipeModalVisible] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [searchRecipe, setSearchRecipe] = useState("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [newRecipe, setNewRecipe] = useState<Recipe>({ id: "", title: "", householdId: "", ingredients: [] });
    const [newIngredient, setNewIngredient] = useState("");
    const [selectedStore, setSelectedStore] = useState("Default");
    const [descriptionHeight, setDescriptionHeight] = useState(100);
    const { householdId } = useHousehold();

    useEffect(() => {
        const q = query(collection(db, "recipes"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipesData: Recipe[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; ingredients: { title: string; storePref: string }[]; description: string; createdAt?: any };
                return {
                    id: doc.id,
                    title: data.title,
                    householdId: data.householdId,
                    ingredients: data.ingredients,
                    description: data.description,
                    createdAt: data.createdAt,
                };
            });
            setRecipes(recipesData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [toastMessage]);

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
        setAddRecipeModalVisible(false);
    };

    const deleteRecipe = async (id: string) => {
        await deleteDoc(doc(db, "recipes", id));
    };

    const updateRecipe = async () => {
        await updateDoc(doc(db, "recipes", newRecipe.id), {
            title: newRecipe.title.trim(),
            ingredients: newRecipe.ingredients,
            description: newRecipe.description || "",
        });
        setToastMessage(`${newRecipe.title} updated successfully!`);
        setAddRecipeModalVisible(false);
    };

    const addIngredient = async () => {
        if (!newIngredient.trim()) return;
        newRecipe.ingredients.push({
            title: newIngredient.trim(),
            storePref: selectedStore,
        });
        setNewRecipe({ ...newRecipe });
        setNewIngredient("");
    }

    const deleteIngredient = (title: string) => {
        setNewRecipe({
            ...newRecipe,
            ingredients: newRecipe.ingredients.filter((item) => item.title !== title),
        });
    };

    const addToGroceryList = async () => {
        const batch = writeBatch(db);
        newRecipe.ingredients.forEach((ingredient) => {
            const groceryRef = doc(collection(db, "groceries"));
            batch.set(groceryRef, {
                title: ingredient.title,
                householdId: householdId,
                storePref: ingredient.storePref,
                createdAt: serverTimestamp(),
            });
        });
        await batch.commit();
        setToastMessage("Added ingredients to grocery list!");
    }

    return (
        <View>
            {sortModalVisible && (
                <div style={{ width: "100%", height: "100%", backgroundColor: "black", position: "absolute", opacity: 0.5, zIndex: 3 }} />
            )}
            <View style={styles.container}>
                {toastMessage && (
                    <View style={styles.toast}>
                        <Text style={styles.toastText}>{toastMessage}</Text>
                    </View>
                )}
                <View style={styles.one_row}>
                    <Text style={styles.header}>All recipes</Text>
                    <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                        setNewRecipe({ id: "", title: "", householdId: "", ingredients: [] });
                        setAddRecipeModalVisible(true)
                        setShouldUpdate(false);
                    }}>
                        <Ionicons name="add" size={24} />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchRecipe}>
                    <Ionicons name="search" size={18} style={{ alignContent: "center" }} />
                    <TextInput
                        style={{ paddingLeft: 8 }}
                        placeholder="Search here"
                        placeholderTextColor={"gray"}
                        value={searchRecipe}
                        onChangeText={setSearchRecipe}>
                    </TextInput>
                </View>
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
                <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                    <FlatList
                        data={recipes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.recipeRow} onPress={() => {
                                setNewRecipe(item);
                                setAddRecipeModalVisible(true);
                                setShouldUpdate(true);
                            }}>
                                <Image
                                    source={{ uri: "" }}
                                    style={{ width: 75, height: 75, marginRight: 12, backgroundColor: "lightgray", borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}>
                                </Image>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, marginTop: 16, marginBottom: 8 }}>{item.title}</Text>
                                    <Ionicons name="stopwatch" size={16} style={{ marginBottom: 16 }}>
                                        <Text style={{ marginLeft: 4, fontWeight: "light", fontSize: 12 }}>25 min</Text>
                                    </Ionicons>
                                </View>
                                <TouchableOpacity style={styles.addToCalenderButton} onPress={() => {
                                    setNewRecipe({ id: "", title: "", householdId: "", ingredients: [] });
                                    setAddRecipeModalVisible(true)
                                    setShouldUpdate(false);
                                }}>
                                    <Ionicons name="calendar" size={16} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}>
                    </FlatList>
                </ScrollView>
            </View>

            {/* Add Recipe Modal */}
            <Modal style={styles.modal}
                visible={addRecipeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAddRecipeModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    {toastMessage && (
                        <View style={styles.toast}>
                            <Text style={styles.toastText}>{toastMessage}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setAddRecipeModalVisible(false)}><Ionicons name="close" size={24} /></TouchableOpacity>
                    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                        <TextInput
                            placeholder="Enter recipe name"
                            value={newRecipe.title}
                            onChangeText={(text) => setNewRecipe({ ...newRecipe, title: text })}
                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 }} />
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter ingredient name"
                                value={newIngredient}
                                onChangeText={setNewIngredient}
                            />
                            <select style={styles.select} value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                                {stores.map((store) => (
                                    <option key={store} value={store}>{store}</option>
                                ))}
                            </select>
                            <View style={{ margin: 3 }}>
                                <Button title="Add" onPress={() => addIngredient()} />
                            </View>
                        </View>
                        <Text style={styles.title}>Ingredients</Text>
                        <View>
                            <FlatList
                                data={newRecipe.ingredients}
                                keyExtractor={(item) => item.title}
                                renderItem={({ item }) => (
                                    <View style={styles.ingredientRow}>
                                        <Text style={{ fontSize: 18 }}>{item.title}</Text>
                                        <Button title="Delete" onPress={() => deleteIngredient(item.title)} />
                                    </View>
                                )}
                            />
                        </View>
                        <Text style={styles.title}>Description</Text>
                        <TextInput
                            value={newRecipe.description}
                            onChangeText={(text) => setNewRecipe({ ...newRecipe, description: text })}
                            placeholder="Add a description"
                            multiline
                            textAlignVertical="top"
                            scrollEnabled={false}
                            onContentSizeChange={(e) => {
                                setDescriptionHeight(Math.max(100, e.nativeEvent.contentSize.height))
                            }
                            }
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                padding: 12,
                                height: descriptionHeight,
                                overflow: "hidden",
                                marginBottom: 16,
                                fontSize: 16,
                                backgroundColor: "#fff",
                            }} />
                        {newRecipe.title.trim() && !shouldUpdate ? (
                            <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                        ) : !shouldUpdate ? (
                            <TouchableOpacity style={styles.addRecipeButtonDisabled} disabled={true} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                        ) : (
                            <View>
                                <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={updateRecipe}><Text>Update recipe</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.addRecipeButtonEnabled} onPress={addToGroceryList}><Text>Add Ingredients to Grocery List</Text></TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>

            {/* Sort Modal */}
            <Modal style={styles.modal}
                visible={sortModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <TouchableOpacity style={{ width: "100%", height: "100%", backgroundColor: "Red", position: "absolute" }} onPress={() => setSortModalVisible(false)}></TouchableOpacity>
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
        </View>



    )
}



