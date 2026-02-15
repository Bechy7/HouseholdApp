import { Ionicons } from "@expo/vector-icons";
import { collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import RecipeView from "../recipes/recipeView";
import { emptyRecipeData, Meal, Recipe } from "../tabs/recipes";
import { emptyTaskData, PlannedTask, Task } from "../tabs/tasks";
import ProgressBar from "./progressBar";

export default function HomeView() {
    enum TimeState { Day, Week, Month }
    const [timeView, setTimeView] = useState<TimeState>(TimeState.Day);
    const [filteringDay, setFilteringDay] = useState<Date>(new Date());
    const [meals, setMeals] = useState<Meal[]>([])
    const [plannedTasks, setPlannedTasks] = useState<PlannedTask[]>([])
    const [checkedMeals, setCheckedMeals] = useState<string[]>([]);
    const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
    const [recipeData, setRecipeData] = useState<Recipe>(emptyRecipeData)
    const [viewRecipeModalVisible, setViewRecipeModalVisible] = useState(false);
    const [taskData, setTaskData] = useState<Task>(emptyTaskData)
    const [viewTaskModalVisible, setViewTaskModalVisible] = useState(false);

    const { householdId } = useHousehold();

    useEffect(() => {
        const q = query(collection(db, "meals"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mealsData: Meal[] = snapshot.docs.map((doc) => {
                const data = doc.data() as {
                    createdAt?: any;
                    title: string;
                    householdId: string;
                    cookingTime?: string;
                    recipeId: string;
                    date: Timestamp;
                };
                return {
                    id: doc.id,
                    createdAt: data.createdAt,
                    title: data.title,
                    householdId: data.householdId,
                    cookingTime: data.cookingTime ?? "0",
                    recipeId: data.recipeId,
                    date: data.date
                };
            });
            setMeals(mealsData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const q = query(collection(db, "plannedTasks"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const plannedTasksData: PlannedTask[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { householdId: string; title: string; taskId: string; date: Timestamp };
                return {
                    id: doc.id,
                    householdId: data.householdId,
                    title: data.title,
                    taskId: data.taskId,
                    date: data.date
                };
            });
            setPlannedTasks(plannedTasksData);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
    };

    const formatDate = (ts: Date) =>
        new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
        }).format(ts);

    const formatDateWithYear = (ts: Date) =>
        new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(ts);

    const toggleMealsCheckbox = (id: string) => {
        setCheckedMeals(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const toggleTasksCheckbox = (id: string) => {
        setCheckedTasks(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const getRecipeFromMeal = async (meal: Meal) => {
        const recipeRef = doc(db, "recipes", meal.recipeId);
        const snap = await getDoc(recipeRef);

        if (!snap.exists()) return emptyRecipeData;

        return {
            id: snap.id,
            ...snap.data(),
        } as Recipe;
    };

    const getTaskFromPlannedTask = async (plannedTask: PlannedTask) => {
        const taskRef = doc(db, "tasks", plannedTask.taskId);
        const snap = await getDoc(taskRef);

        if (!snap.exists()) return emptyTaskData;

        return {
            id: snap.id,
            ...snap.data(),
        } as Task;
    };

    const DateButtonsView = () => {
        return (
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.bigRoundButtonShadow} onPress={() =>
                    setFilteringDay((prev) => {
                        const d = new Date(prev);
                        d.setDate(d.getDate() - 1);
                        return d;
                    })
                }>
                    <Ionicons name="chevron-back" size={16} />
                </TouchableOpacity>
                <Text style={{ ...styles.textMedium, alignSelf: "center" }}>{formatDateWithYear(filteringDay)}</Text>
                <TouchableOpacity style={styles.bigRoundButtonShadow} onPress={() =>
                    setFilteringDay((prev) => {
                        const d = new Date(prev);
                        d.setDate(d.getDate() + 1);
                        return d;
                    })
                }>
                    <Ionicons name="chevron-forward" size={16} />
                </TouchableOpacity>
            </View>
        )
    }

    const mealsView = () => {
        const filteredMeals = meals.filter((meal) =>
            formatDateWithYear(meal.date.toDate()) === formatDateWithYear(filteringDay)
        );

        return filteredMeals.length > 0 && (
            <View style={{ marginBottom: 16 }}>
                <Text style={{ ...styles.textMedium, marginBottom: 8 }}>Meals</Text>
                <View>
                    <FlatList
                        data={filteredMeals}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.recipeRow} onPress={async () => {
                                setRecipeData(await getRecipeFromMeal(item));
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
                                <Pressable style={styles.checkbox}
                                    onPress={() => toggleMealsCheckbox(item.title)}>
                                    <View style={styles.smallCheckbox}>
                                        <Ionicons color={checkedMeals.includes(item.title) ? "#2EB23D" : "gray"} name="checkmark-circle" size={32}></Ionicons>
                                    </View>
                                </Pressable>
                            </TouchableOpacity>
                        )} />
                </View>
            </View>)
    }

    const taskView = () => {
        const filteredTasks = plannedTasks.filter((task) =>
            formatDateWithYear(task.date.toDate()) === formatDateWithYear(filteringDay)
        );

        return filteredTasks.length > 0 && (
            <View>
                <Text style={{ ...styles.textMedium, marginBottom: 8 }}>Tasks</Text>
                <View>
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{ ...styles.recipeRow, height: 56 }} onPress={async () => {
                                setTaskData(await getTaskFromPlannedTask(item));
                                setViewTaskModalVisible(true);
                            }}>
                                <Text style={{ ...styles.textMedium, marginLeft: 12 }}>{item.title}</Text>
                                <Pressable style={styles.checkbox}
                                    onPress={() => toggleTasksCheckbox(item.title)}>
                                    <View style={styles.smallCheckbox}>
                                        <Ionicons color={checkedTasks.includes(item.title) ? "#2EB23D" : "gray"} name="checkmark-circle" size={32}></Ionicons>
                                    </View>
                                </Pressable>
                            </TouchableOpacity>
                        )} />
                </View>
            </View>)
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.header}>Hi, USER 👋</Text>
                <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                    // handleLogout();
                }}>
                    <Ionicons name="settings" size={24} />
                </TouchableOpacity>
            </View>

            <View style={{ ...styles.row, marginTop: 8, marginBottom: 24, justifyContent: "flex-start" }}>
                <Ionicons style={{ marginRight: 8 }} name="calendar" size={16} />
                <Text>Today is {formatDate(new Date())}</Text>
            </View>

            <View style={styles.row}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setTimeView(TimeState.Day)}>
                    <Text style={{ alignSelf: "center", fontWeight: timeView == TimeState.Day ? "bold" : "normal" }}>Day</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setTimeView(TimeState.Week)}>
                    <Text style={{ alignSelf: "center", fontWeight: timeView == TimeState.Week ? "bold" : "normal" }}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setTimeView(TimeState.Month)}>
                    <Text style={{ alignSelf: "center", fontWeight: timeView == TimeState.Month ? "bold" : "normal" }}>Month</Text>
                </TouchableOpacity>
            </View>
            <ProgressBar currentStep={
                timeView == TimeState.Day ? 0 : timeView == TimeState.Week ? 1 : 2
            } />

            <DateButtonsView />
            <ScrollView>
                {mealsView()}
                {taskView()}
            </ScrollView>

            {/* View Recipe Modal */}
            <Modal style={styles.modal}
                visible={viewRecipeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setViewRecipeModalVisible(false)}
            >
                <RecipeView recipe={recipeData} onClose={() => setViewRecipeModalVisible(false)} />
            </Modal>
        </View>

    )
}