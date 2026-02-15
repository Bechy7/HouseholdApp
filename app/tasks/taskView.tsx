import { Ionicons } from "@expo/vector-icons";
import { collection, doc, getDocs, query, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import React, { useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import useHousehold from "../context/householdContext";
import { Task } from "../tabs/tasks";
import NewTask from "./newTask";

export default function TaskView({ task, plannedDate, onClose }: { task: Task; plannedDate: Timestamp | null; onClose: () => void }) {
    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
    const { householdId } = useHousehold();

    const deleteTask = async () => {
        onClose();
        const batch = writeBatch(db);
        batch.delete(doc(db, "tasks", task.id));
        const plannedTasksSnap = await getDocs(
            query(
                collection(db, "plannedTasks"),
                where("taskId", "==", task.id),
                where("householdId", "==", householdId)
            )
        );
        plannedTasksSnap.forEach((task) => {
            batch.delete(task.ref);
        });

        await batch.commit();
    };

    const editTask = async () => {
        setAddTaskModalVisible(true);
    };

    const toggleCheckbox = (id: string) => {
        setCheckedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const formatDate = (ts: Timestamp) =>
        new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(ts.toDate());

    const finishTask = async () => {
        const user = auth.currentUser;
        if (!user) return;
        onClose();
        await updateDoc(doc(db, "tasks", task.id), {
            finished: true
        });
    }

    const checklistView = () => {
        return (
            <View>
                <FlatList
                    data={task.checklist}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item }) => (
                        <View style={{ ...styles.listRow, marginRight: 8 }}>
                            <Pressable style={styles.ingredientCheckbox}
                                onPress={() => toggleCheckbox(item.title)}>
                                {checkedIds.includes(item.title) &&
                                    <View style={styles.smallCheckbox}>
                                        <Ionicons name="checkbox" size={28}></Ionicons>
                                    </View>}
                            </Pressable>
                            <View style={{ flex: 1, justifyContent: "flex-start" }}>
                                <Text style={{ fontSize: 16 }}>{item.title}</Text>
                            </View>
                            <View style={{ ...styles.mediumRoundButton, backgroundColor: "#806752" }}>
                                <Ionicons name={"person"} color={"white"}></Ionicons>
                            </View>
                        </View>
                    )}
                />
            </View>
        )
    }

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={{ display: "flex" }} keyboardShouldPersistTaps="handled">
                <View style={{ backgroundColor: "#F4F6F7" }}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.bigRoundButton} onPress={() => onClose()}><Ionicons name="chevron-back" size={16} /></TouchableOpacity>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.bigRoundButton} onPress={() => editTask()}><Ionicons name="pencil" size={16} /></TouchableOpacity>
                            <TouchableOpacity style={styles.bigRoundButton} onPress={() => deleteTask()}><Ionicons name="trash" size={16} /></TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ ...styles.modalContainer, paddingHorizontal: 16, padding: 0 }}>
                        <Text style={{ ...styles.title, marginTop: 0 }}> {task.title} </Text>
                        {plannedDate && (
                            <View style={{ ...styles.row, margin: 8, justifyContent: "flex-start", marginBottom: 16 }}>
                                <Ionicons style={{ marginRight: 8 }} name="calendar" size={16} />
                                <Text>{formatDate(plannedDate)}</Text>
                            </View>
                        )}
                        {checklistView()}
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={finishTask}>
                            <Text style={styles.textNextButton}>Finish task</Text>
                        </TouchableOpacity>
                    </View>

                </View>



                <Modal style={styles.modal}
                    visible={addTaskModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => {
                        setAddTaskModalVisible(false)
                        onClose();
                    }}
                >
                    <NewTask task={task} onClose={() => {
                        setAddTaskModalVisible(false)
                        onClose();
                    }} />
                </Modal>
            </ScrollView>
        </View>

    )
}