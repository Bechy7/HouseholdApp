import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";
import { Checklist, emptyTaskData, PlannedTask, Task } from "../tabs/tasks";
import NewTask from "./newTask";
import ProgressBar from "./newTask/progressBar";
import TaskView from "./taskView";

export default function TaskList() {
    const { householdId } = useHousehold();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [plannedTasks, setPlannedtasks] = useState<PlannedTask[]>([]);
    const [task, setTask] = useState<Task>({ title: "", id: "", householdId, checklist: [], saveTask: false, repeatTask: false, finished: false });
    const [plannedDate, setPlannedDate] = useState<Timestamp | null>(null)
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
    const [viewTaskModalVisible, setViewTaskModalVisible] = useState(false);
    const [showSavedTasks, setShowSavedTasks] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "tasks"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: Task[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; checklist: Checklist[]; saveTask: boolean; repeatTask: boolean; finished: boolean };
                return {
                    id: doc.id,
                    householdId: data.householdId,
                    title: data.title,
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

    useEffect(() => {
        const q = query(collection(db, "plannedTasks"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: PlannedTask[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; taskId: string, date: Timestamp };
                return {
                    id: doc.id,
                    title: data.title,
                    householdId: data.householdId,
                    taskId: data.taskId,
                    date: data.date
                };
            });
            setPlannedtasks(tasksData);
        });

        return () => unsubscribe();
    }, []);

    const deletePlannedTask = async (id: string) => {
        await deleteDoc(doc(db, "plannedTasks", id));
    };

    const addPlannedTask = async (task: Task) => {
        const user = auth.currentUser;
        if (!user) return;
        await addDoc(collection(db, "plannedTasks"), {
            createdAt: serverTimestamp(),
            taskId: task.id,
            title: task.title,
            householdId: task.householdId,
            date: Timestamp.now()
        });
    }

    const formatDate = (ts: Timestamp) =>
        new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(ts.toDate());

    const getTaskFromPlannedTask = async (plannedTask: PlannedTask) => {
        const taskRef = doc(db, "tasks", plannedTask.taskId);
        const snap = await getDoc(taskRef);

        if (!snap.exists()) return emptyTaskData;

        return {
            id: snap.id,
            ...snap.data(),
        } as Task;
    };

    const savedTasksView = () => {
        const filteredTasks = tasks.filter((task) => task.saveTask)
        return (
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listRow} onPress={() => {
                        setTask(item)
                        setPlannedDate(null)
                        setViewTaskModalVisible(true)
                    }}>
                        <View>
                            <Text style={styles.textMedium}>{item.title}</Text>
                        </View>
                        <TouchableOpacity style={{ ...styles.addToCalenderButton, backgroundColor: "#806752" }} onPress={() => addPlannedTask(item)}>
                            <Ionicons style={{ color: "white" }} name="calendar" size={16} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        )
    }

    const plannedTasksView = () => {
        const filteredTasks = plannedTasks.filter((task) => task.date)
        return (
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listRow} onPress={async () => {
                        setTask(await getTaskFromPlannedTask(item));
                        setPlannedDate(item.date);
                        setViewTaskModalVisible(true);
                    }}>
                        <View>
                            <Text style={styles.textMedium}>{item.title}</Text>
                            {item.date && (
                                <View style={{ ...styles.row, marginTop: 8, justifyContent: "flex-start" }}>
                                    <Ionicons style={{ marginRight: 8 }} name="calendar" size={16} />
                                    <Text>{formatDate(item.date)}</Text>
                                </View>
                            )}

                        </View>
                        <TouchableOpacity style={{ ...styles.addToCalenderButton, backgroundColor: "#806752" }} onPress={() => deletePlannedTask(item.id)}>
                            <Ionicons style={{ color: "white" }} name="trash" size={16} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        )
    }

    return (<View style={styles.modalContainer}>
        <View style={styles.row}>
            <Text style={styles.title}>Tasks</Text>
            <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                setTask({ title: "", id: "", householdId, checklist: [], saveTask: false, repeatTask: false, finished: false })
                setAddTaskModalVisible(true);
            }}>
                <Ionicons name="add" size={24} />
            </TouchableOpacity>
        </View>

        <View style={styles.row}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowSavedTasks(false)}>
                <Text style={{ alignSelf: "center", fontWeight: showSavedTasks ? "normal" : "bold" }}>Planned tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowSavedTasks(true)}>
                <Text style={{ alignSelf: "center", fontWeight: showSavedTasks ? "bold" : "normal" }}>Saved tasks</Text>
            </TouchableOpacity>
        </View>
        <ProgressBar currentStep={showSavedTasks ? 1 : 0} />

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
            {showSavedTasks ? savedTasksView() : plannedTasksView()}
        </ScrollView>

        <Modal style={styles.modal}
            visible={addTaskModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setAddTaskModalVisible(false)}
        >
            <NewTask task={task} onClose={() => setAddTaskModalVisible(false)} />
        </Modal>

        <Modal style={styles.modal}
            visible={viewTaskModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setViewTaskModalVisible(false)}
        >
            <TaskView task={task} plannedDate={plannedDate} onClose={() => setViewTaskModalVisible(false)} />
        </Modal>
    </View>)
}