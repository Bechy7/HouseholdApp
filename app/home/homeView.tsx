import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import { HomeContext } from "../context/homeContext";
import useHousehold from "../context/householdContext";
import { emptyRecipeData, Meal, Recipe } from "../tabs/recipes";
import { emptyTaskData, PlannedTask, Task } from "../tabs/tasks";
import { getWeekDays, getWeekStart } from "../utils/dateHelper";
import ProgressBar from "./progressBar";

type Props = NativeStackScreenProps<any>;
export default function HomeView({ navigation }: Props) {
    const homeContext = useContext(HomeContext);
    if (!homeContext) return null;
    const { setNewRecipe, setNewTask } = homeContext;

    enum TimeState { Day, Week, Month }
    enum DesireState { Meals, Tasks }
    const [timeView, setTimeView] = useState<TimeState>(TimeState.Day);
    const [desire, setDesire] = useState<DesireState>(DesireState.Meals);
    const [filteringDay, setFilteringDay] = useState<Date>(new Date());
    const [meals, setMeals] = useState<Meal[]>([])
    const [plannedTasks, setPlannedTasks] = useState<PlannedTask[]>([])
    const [checkedMeals, setCheckedMeals] = useState<string[]>([]);
    const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
    const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);

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
                    imageUrl: string;
                };
                return {
                    id: doc.id,
                    createdAt: data.createdAt,
                    title: data.title,
                    householdId: data.householdId,
                    cookingTime: data.cookingTime ?? "0",
                    recipeId: data.recipeId,
                    date: data.date,
                    imageUrl: data.imageUrl
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

    const formatDateShort = (ts: Date) =>
        new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
        }).format(ts);

    const formatDateWithYear = (ts: Date) =>
        new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(ts);

    const formatDateWithDay = (ts: Date) =>
        new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "long",
            day: "numeric",
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

    const goToNextWeek = () => {
        setCurrentWeekStart(prev => {
            const next = new Date(prev);
            next.setDate(prev.getDate() + 7);
            return next;
        });
    };

    const goToPreviousWeek = () => {
        setCurrentWeekStart(prev => {
            const prevWeek = new Date(prev);
            prevWeek.setDate(prev.getDate() - 7);
            return prevWeek;
        });
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
            date: plannedTask.date,
            ...snap.data(),
        } as Task;
    };

    const DayButtonsView = () => {
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

    const WeekButtonsView = () => {
        return (
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.bigRoundButtonShadow} onPress={goToPreviousWeek}>
                    <Ionicons name="chevron-back" size={16} />
                </TouchableOpacity>
                <Text style={{ ...styles.textMedium, alignSelf: "center" }}>{formatDateShort(weekDays[0])} - {formatDateShort(weekDays[6])}</Text>
                <TouchableOpacity style={styles.bigRoundButtonShadow} onPress={goToNextWeek}>
                    <Ionicons name="chevron-forward" size={16} />
                </TouchableOpacity>
            </View>
        )
    }

    const mealFlatList = (filteredMeals: Meal[]) =>
        <FlatList
            data={filteredMeals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.recipeRow} onPress={async () => {
                    setNewRecipe(await getRecipeFromMeal(item));
                    navigation.navigate("recipeView");
                }}>
                    <Image
                        source={{ uri: item.imageUrl || "" }}
                        style={styles.RecipeListImage} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, marginTop: 16, marginBottom: 8 }}>{item.title}</Text>
                        <Ionicons name="stopwatch" size={16} style={{ marginBottom: 16 }}>
                            <Text style={{ marginLeft: 4, fontWeight: "light", fontSize: 12 }}>{item.cookingTime || "0"} min</Text>
                        </Ionicons>
                    </View>
                    <Pressable style={styles.checkbox}
                        onPress={() => toggleMealsCheckbox(item.id)}>
                        <View style={styles.smallCheckbox}>
                            <Ionicons color={checkedMeals.includes(item.id) ? "#2EB23D" : "gray"} name="checkmark-circle" size={32}></Ionicons>
                        </View>
                    </Pressable>
                </TouchableOpacity>
            )} />

    const taskFlatList = (filteredTasks: PlannedTask[]) =>
        <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity style={{ ...styles.recipeRow, height: 56 }} onPress={async () => {
                    setNewTask(await getTaskFromPlannedTask(item));
                    navigation.navigate("taskView");
                }}>
                    <Text style={{ ...styles.textMedium, marginLeft: 12 }}>{item.title}</Text>
                    <Pressable style={styles.checkbox}
                        onPress={() => toggleTasksCheckbox(item.id)}>
                        <View style={styles.smallCheckbox}>
                            <Ionicons color={checkedTasks.includes(item.id) ? "#2EB23D" : "gray"} name="checkmark-circle" size={32}></Ionicons>
                        </View>
                    </Pressable>
                </TouchableOpacity>
            )} />


    const mealsDayView = () => {
        const filteredMeals = meals.filter((meal) =>
            formatDateWithYear(meal.date.toDate()) === formatDateWithYear(filteringDay)
        );

        return filteredMeals.length > 0 && (
            <View style={{ marginBottom: 16 }}>
                <Text style={{ ...styles.textMedium, marginBottom: 8 }}>Meals</Text>
                {mealFlatList(filteredMeals)}
            </View>
        )
    }

    const mealsWeekView = () => {
        return (
            <View>
                {weekDays.map((day) => {
                    const filteredMeals = meals.filter((meal) =>
                        formatDateWithYear(meal.date.toDate()) === formatDateWithYear(day)
                    );
                    return (
                        <View key={day.toISOString()}>
                            {filteredMeals.length > 0 && (
                                <View>
                                    <Text style={{ ...styles.textMedium, marginVertical: 16 }}>{formatDateWithDay(day)}</Text>
                                    {mealFlatList(filteredMeals)}
                                </View>
                            )}
                        </View>
                    )
                })}

            </View>
        )
    }

    const taskDayView = () => {
        const filteredTasks = plannedTasks.filter((task) =>
            formatDateWithYear(task.date.toDate()) === formatDateWithYear(filteringDay)
        );

        return filteredTasks.length > 0 && (
            <View>
                <Text style={{ ...styles.textMedium, marginBottom: 8 }}>Tasks</Text>
                {taskFlatList(filteredTasks)}
            </View>
        )
    }

    const taskWeekView = () => {
        return (
            <View>
                {weekDays.map((day) => {
                    const filteredTasks = plannedTasks.filter((task) =>
                        formatDateWithYear(task.date.toDate()) === formatDateWithYear(day)
                    );
                    return (
                        <View key={day.toISOString()}>
                            {filteredTasks.length > 0 && (
                                <View>
                                    <Text style={{ ...styles.textMedium, marginVertical: 16 }}>{formatDateWithDay(day)}</Text>
                                    {taskFlatList(filteredTasks)}
                                </View>
                            )}
                        </View>
                    )
                })}

            </View>
        )
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

            <ScrollView>
                {timeView == TimeState.Day &&
                    <>
                        <DayButtonsView />
                        <ScrollView>
                            {mealsDayView()}
                            {taskDayView()}
                        </ScrollView>
                    </>
                }

                {timeView == TimeState.Week &&
                    <>
                        <WeekButtonsView />
                        <ScrollView>
                            <View style={{ flexDirection: "row", width: 100, justifyContent: "space-between" }}>
                                <View>
                                    <TouchableOpacity style={{ flex: 1, marginBottom: 8 }} onPress={() => setDesire(DesireState.Meals)}>
                                        <Text style={{ alignSelf: "flex-start", color: desire == DesireState.Meals ? "#806752" : "black" }}>Meals</Text>
                                    </TouchableOpacity>
                                    {desire == DesireState.Meals &&
                                        <View style={styles.barContainer}>
                                            <View style={styles.lineActive} />
                                        </View>
                                    }
                                </View>

                                <View>
                                    <TouchableOpacity style={{ flex: 1, marginBottom: 8 }} onPress={() => setDesire(DesireState.Tasks)}>
                                        <Text style={{ alignSelf: "flex-start", color: desire == DesireState.Tasks ? "#806752" : "black" }}>Tasks</Text>
                                    </TouchableOpacity>
                                    {desire == DesireState.Tasks &&
                                        <View style={styles.barContainer}>
                                            <View style={styles.lineActive} />
                                        </View>
                                    }
                                </View>
                            </View>
                            {desire == DesireState.Meals && mealsWeekView()}
                            {desire == DesireState.Tasks && taskWeekView()}
                        </ScrollView>
                    </>
                }
            </ScrollView>
        </View>
    )
}