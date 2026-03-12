import { HomeContext } from "@/app/context/homeContext";
import useHousehold from "@/app/context/householdContext";
import { auth, db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { FlatList, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import { TaskContext } from "../../context/taskContext";
import ProgressBar from "./progressBar";

type Props = NativeStackScreenProps<any>;

export default function ChecklistPage({ navigation }: Props) {
    const taskContext = useContext(TaskContext);
    const homeContext = useContext(HomeContext);
    if (!taskContext && !homeContext) return null;
    const { newTask, setNewTask } = taskContext || homeContext!;
    const [newSubTask, setNewSubTask] = useState("");

    const { householdId } = useHousehold();
    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const batch = writeBatch(db);

    const addTask = async () => {
        const user = auth.currentUser;
        if (!user) return;
        navigation.pop(2);
        const tasksRef = doc(collection(db, "tasks"))

        batch.set(tasksRef, {
            createdAt: serverTimestamp(),
            title: newTask.title.trim(),
            householdId,
            checklist: newTask.checklist,
            saveTask: newTask.saveTask,
            repeatTask: newTask.repeatTask,
            finished: newTask.finished
        });

        if (newTask.date) {
            const plannedTasksRef = doc(collection(db, "plannedTasks"));

            batch.set(plannedTasksRef, {
                createdAt: serverTimestamp(),
                taskId: tasksRef.id,
                title: newTask.title.trim(),
                householdId,
                date: newTask.date
            });
        }

        await batch.commit();
    };

    const editTask = async () => {
        const user = auth.currentUser;
        if (!user) return;
        navigation.pop(2);
        await updateDoc(doc(db, "tasks", newTask.id), {
            createdAt: serverTimestamp(),
            title: newTask.title.trim(),
            householdId,
            checklist: newTask.checklist,
            saveTask: newTask.saveTask,
            repeatTask: newTask.repeatTask,
            finished: newTask.finished
        });
    };

    const addSubTask = async () => {
        if (!newSubTask.trim() || newTask.checklist.some((subTask) => subTask.title === newSubTask)) return;
        newTask.checklist.push({
            title: newSubTask.trim(),
        });

        setNewTask({ ...newTask });
        setNewSubTask("");
    }

    const deleteSubTask = (title: string) => {
        setNewTask({
            ...newTask,
            checklist: newTask.checklist.filter((item) => item.title !== title),
        });
    };

    const toggleCheckbox = (id: string) => {
        setCheckedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.title}>Create a task</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.pop(2)}><Ionicons name="close" size={24} /></TouchableOpacity>
            </View>
            <View style={{ ...styles.row, paddingTop: 16 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ alignSelf: "center" }}>Task info</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ alignSelf: "center", fontWeight: "bold" }}>Checklist</Text>
                </View>
            </View>
            <ProgressBar currentStep={1} />
            <View style={{ marginTop: 8 }}>
                <Text style={styles.textMedium}>Add Task</Text>
                <TextInput
                    placeholder="Write task here"
                    placeholderTextColor="gray"
                    value={newSubTask}
                    onChangeText={(text) => setNewSubTask(text)}
                    style={styles.textInput} />
            </View>
            <TouchableOpacity
                style={styles.addIngredientButton}
                onPress={addSubTask}>
                <Text style={{ ...styles.textMedium, color: "white" }}>Add task</Text>
            </TouchableOpacity>

            {newTask.checklist.length > 0 && (
                <View style={{ paddingTop: 16 }}>
                    <Text style={styles.textMedium}> Checklist</Text>
                </View>
            )}
            <FlatList
                style={styles.scrollView}
                data={newTask.checklist}
                keyExtractor={(item) => item.title}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <View style={styles.listRow}>
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

                        <Text style={{ fontSize: 16 }}>
                            {item.title}
                        </Text>

                        <TouchableOpacity
                            style={{ ...styles.mediumRoundButton, backgroundColor: "#806752" }}
                            onPress={() => deleteSubTask(item.title)}
                        >
                            <Ionicons style={{ color: "white" }} name="trash" size={16} />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={navigation.goBack}>
                    <Text style={styles.textMedium}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={newTask.id ? editTask : addTask}>
                    <Text style={styles.textNextButton}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
