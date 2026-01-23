import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import { emptyRecipeData, Recipe, Tag } from "../tabs/recipes";
import { Checklist, emptyTaskData, Task } from "../tabs/tasks";
import ProgressBar from "./progressBar";

export default function HomeView() {
    enum TimeState { Day, Week, Month }
    const [timeView, setTimeView] = useState<TimeState>(TimeState.Day);
    const [day, setDay] = useState<Date>(new Date());
    const [meals, setMeals] = useState<Recipe[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [checkedMeals, setCheckedMeals] = useState<string[]>([]);
    const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
    const [viewRecipeModalVisible, setViewRecipeModalVisible] = useState(false);
    const [viewTaskModalVisible, setViewTaskModalVisible] = useState(false);
    const [recipeData, setRecipeData] = useState<Recipe>(emptyRecipeData)
    const [taskData, setTaskData] = useState<Task>(emptyTaskData)

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
            setMeals(recipesData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const q = query(collection(db, "tasks"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: Task[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; date?: Timestamp; checklist: Checklist[]; saveTask: boolean; repeatTask: boolean; finished: boolean };
                return {
                    id: doc.id,
                    householdId: data.householdId,
                    title: data.title,
                    date: data.date,
                    checklist: data.checklist,
                    saveTask: data.saveTask,
                    repeatTask: data.repeatTask,
                    finished: data.finished
                };
            });
            setTasks(tasksData);
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


    const DateButtonsView = () => {
        return (
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.bigRoundButtonShadow} onPress={() =>
                    setDay((prev) => {
                        const d = new Date(prev);
                        d.setDate(d.getDate() - 1);
                        return d;
                    })
                }>
                    <Ionicons name="chevron-back" size={16} />
                </TouchableOpacity>
                <Text style={{ ...styles.textMedium, alignSelf: "center" }}>{formatDateWithYear(day)}</Text>
                <TouchableOpacity style={styles.bigRoundButtonShadow} onPress={() =>
                    setDay((prev) => {
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
        return meals.length > 0 && (
            <View style={{marginBottom:16}}>
                <Text style={{ ...styles.textMedium, marginBottom: 8 }}>Meals</Text>
                <View>
                    <FlatList
                        data={meals}
                        keyExtractor={(item) => item.title}
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
        return tasks.length > 0 && (
            <View>
                <Text style={{ ...styles.textMedium, marginBottom: 8 }}>Tasks</Text>
                <View>
                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{...styles.recipeRow, height: 56}} onPress={() => {
                                setTaskData(item);
                                setViewTaskModalVisible(true);
                            }}>
                                <Text style={{...styles.textMedium, marginLeft:12}}>{item.title}</Text>
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


        </View>

    )
}