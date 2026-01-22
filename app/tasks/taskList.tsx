import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";
import { Checklist, Task } from "../tabs/tasks";
import NewTask from "./newTask";
import ProgressBar from "./newTask/progressBar";
import TaskView from "./taskView";

export default function TaskList() {
    const { householdId } = useHousehold();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [task, setTask] = useState<Task>({ title: "", id: "", householdId, checklist: [], saveTask: false, repeatTask: false, finished: false });
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
    const [viewTaskModalVisible, setViewTaskModalVisible] = useState(false);
    const [showSavedTasks, setShowSavedTasks] = useState(false);

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

    const deleteTask = async (id: string) => {
        await deleteDoc(doc(db, "tasks", id));
    };

    const formatDate = (ts: Timestamp) =>
        new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(ts.toDate());

    const taskList = () => {
        const filteredTasks = showSavedTasks ? tasks.filter((task) => task.saveTask) : tasks.filter((task) => task.date)
        return (
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listRow} onPress={() => {
                        setTask(item)
                        setViewTaskModalVisible(true)
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
                        <TouchableOpacity style={{ ...styles.addToCalenderButton, backgroundColor: "#806752" }} onPress={() => deleteTask(item.id)}>
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
            {taskList()}
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
            <TaskView task={task} onClose={() => setViewTaskModalVisible(false)} />
        </Modal>
    </View>)
}