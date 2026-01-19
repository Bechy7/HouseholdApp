import useHousehold from "@/app/context/householdContext";
import { auth, db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import ProgressBar from "./progressBar";
import { TaskContext } from "./taskContext";

type Props = NativeStackScreenProps<any>;

export default function ChecklistPage({ navigation }: Props) {
    const taskContext = useContext(TaskContext);
    if (!taskContext) return null;
    const { newTask, setNewTask } = taskContext;
    const [repeatTask, setRepeatTask] = useState(false);
    const [addSavedTasks, setAddSavedTasks] = useState(false);

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const { householdId } = useHousehold();

    const addTask = async () => {
        const user = auth.currentUser;
        if (!user) return;
        onClose();
        await addDoc(collection(db, "tasks"), {
            createdAt: serverTimestamp(),
            title: newTask.title.trim(),
            householdId,
        });
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.header}>Create a task</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
            </View>
            <ProgressBar currentStep={1} />
            <View>
                <Text style={styles.textMedium}> Name of the recipe *</Text>
                <TextInput
                    placeholder="Write name of the recipe"
                    placeholderTextColor="gray"
                    value={newTask.title}
                    onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                    style={styles.textInput} />
            </View>

            <View style={{ ...styles.row, justifyContent: "flex-start", marginTop: 16 }}>
                <Pressable style={{ ...styles.ingredientCheckbox }}
                    onPress={() => setRepeatTask(!repeatTask)}>
                    {repeatTask &&
                        <View style={styles.inner}>
                            <Ionicons name="checkbox" size={28}></Ionicons>
                        </View>}
                </Pressable>
                <Text style={styles.textMedium}>Repeat task</Text>
            </View>

            <View style={{ ...styles.row, justifyContent: "flex-start", marginTop: 16 }}>
                <Pressable style={{ ...styles.ingredientCheckbox }}
                    onPress={() => setAddSavedTasks(!addSavedTasks)}>
                    {addSavedTasks &&
                        <View style={styles.inner}>
                            <Ionicons name="checkbox" size={28}></Ionicons>
                        </View>}
                </Pressable>
                <Text style={styles.textMedium}>Add to saved tasks</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.addRecipeBackButton}
                        onPress={navigation.goBack}>
                        <Text style={styles.textMedium}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => addTask()}>
                        <Text style={styles.textNextButton}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}
