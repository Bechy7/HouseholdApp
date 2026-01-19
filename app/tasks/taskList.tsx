import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";
import { Checklist, Task } from "../tabs/tasks";
import NewTask from "./newTask";

export default function TaskList() {
    const { householdId } = useHousehold();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [task, setTask] = useState<Task>({ title: "", id: "", householdId, checklist: [] });
    const [taskModalVisible, setTaskModalVisible] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "tasks"),
            where("householdId", "==", householdId),
            orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: Task[] = snapshot.docs.map((doc) => {
                const data = doc.data() as { title: string; householdId: string; date?: Date; checklist: Checklist[] };
                return {
                    id: doc.id,
                    householdId: data.householdId,
                    title: data.title,
                    date: data.date,
                    checklist: data.checklist,
                };
            });
            setTasks(tasksData);
        });

        return () => unsubscribe();
    }, []);

    const deleteTask = async (id: string) => {
        await deleteDoc(doc(db, "tasks", id));
    };

    const storeList = () => {
        return (
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listRow}>
                        <TouchableOpacity style={{ ...styles.addToCalenderButton, backgroundColor: "#806752" }} onPress={() => {
                            setTask(item)
                            setTaskModalVisible(true)
                        }
                        }>
                            <Ionicons style={{ color: "white" }} name="pencil" size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.addToCalenderButton, backgroundColor: "#806752" }} onPress={() => deleteTask(item.id)}>
                            <Ionicons style={{ color: "white" }} name="trash" size={16} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        )

    }

    return (<View style={styles.modalContainer}>
        <View style={styles.row}>
            <Text style={styles.title}>Tasks</Text>
            <TouchableOpacity style={styles.openRecipeModuleButton} onPress={() => {
                setTask({ title: "", id: "", householdId, checklist: [] })
                setTaskModalVisible(true);
            }}>
                <Ionicons name="add" size={24} />
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
            {storeList()}
        </ScrollView>

        <Modal style={styles.modal}
            visible={taskModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setTaskModalVisible(false)}
        >
            <NewTask task={task} onClose={() => setTaskModalVisible(false)} />
        </Modal>
    </View>)
}