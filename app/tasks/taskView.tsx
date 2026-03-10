import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, getDocs, query, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../styles";
import { HomeContext } from "../context/homeContext";
import useHousehold from "../context/householdContext";
import { TaskContext } from "../context/taskContext";

type Props = NativeStackScreenProps<any>;
export default function TaskView({ navigation }: Props) {
    const taskContext = useContext(TaskContext);
    const homeContext = useContext(HomeContext);
    if (!taskContext && !homeContext) return null;
    const { newTask } = taskContext || homeContext!;
    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const { householdId } = useHousehold();

    const deleteTask = async () => {
        navigation.goBack();
        const batch = writeBatch(db);
        batch.delete(doc(db, "tasks", newTask.id));
        const plannedTasksSnap = await getDocs(
            query(
                collection(db, "plannedTasks"),
                where("taskId", "==", newTask.id),
                where("householdId", "==", householdId)
            )
        );
        plannedTasksSnap.forEach((task) => {
            batch.delete(task.ref);
        });

        await batch.commit();
    };

    const editTask = async () => {
        navigation.navigate("taskInfoPage")
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
        navigation.goBack();
        await updateDoc(doc(db, "tasks", newTask.id), {
            finished: true
        });
    }

    const checklistView = () => {
        return (
            <View>
                <FlatList
                    data={newTask.checklist}
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
                        <TouchableOpacity style={styles.bigRoundButton} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={16} /></TouchableOpacity>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.bigRoundButton} onPress={() => editTask()}><Ionicons name="pencil" size={16} /></TouchableOpacity>
                            <TouchableOpacity style={styles.bigRoundButton} onPress={() => deleteTask()}><Ionicons name="trash" size={16} /></TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ ...styles.modalContainer, paddingHorizontal: 16, padding: 0 }}>
                        <Text style={{ ...styles.title, marginTop: 0 }}> {newTask.title} </Text>
                        {newTask.date && (
                            <View style={{ ...styles.row, margin: 8, justifyContent: "flex-start", marginBottom: 16 }}>
                                <Ionicons style={{ marginRight: 8 }} name="calendar" size={16} />
                                <Text>{formatDate(newTask.date)}</Text>
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
            </ScrollView>
        </View>

    )
}