import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Timestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Platform, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import { TaskContext } from "../../context/taskContext";
import ProgressBar from "./progressBar";

type Props = NativeStackScreenProps<any>;

export default function TaskInfoPage({ navigation }: Props) {
    const taskContext = useContext(TaskContext);
    if (!taskContext) return null;
    const { newTask, setNewTask } = taskContext;
    const [showPicker, setShowPicker] = useState(false);

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const requiredFieldsFilled = newTask.title.trim().length > 0;

    const formatDate = (ts: Timestamp) => {
        const d = ts.toDate();
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const showCalendar = () => {
        // ---------- WEB ----------
        if (Platform.OS === "web") {
            return (
                <input
                    type="date"
                    value={
                        newTask.date
                            ? newTask.date.toDate().toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                        setNewTask({
                            ...newTask,
                            date: Timestamp.fromDate(new Date(e.target.value))
                        })
                    }
                    style={{
                        padding: 12,
                        borderRadius: 20,
                        border: "1px solid #000000ff",
                        fontSize: 16,
                    }}
                />
            );
        }

        // ---------- IOS / ANDROID ----------
        return (
            <View>
                <Pressable onPress={() => setShowPicker(true)}>
                    <TextInput
                        editable={false}
                        placeholder="Select date"
                        value={newTask.date ? formatDate(newTask.date) : ""}
                        style={{
                            borderWidth: 1,
                            padding: 12,
                            borderRadius: 6,
                        }}
                    />
                </Pressable>

                {showPicker && (
                    <DateTimePicker
                        value={newTask.date ? newTask.date.toDate() : new Date()}
                        mode="date"
                        display="default"
                        onChange={(_, selectedDate) => {
                            setShowPicker(false);
                            if (selectedDate) {
                                setNewTask({
                                    ...newTask,
                                    date: Timestamp.fromDate(selectedDate)
                                });
                            }
                        }}
                    />
                )}
            </View>
        );
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.title}>Create a task</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
            </View>
            <View style={{...styles.row, paddingTop:16}}>
                <View style={{ flex: 1 }}>
                    <Text style={{ alignSelf: "center", fontWeight: "bold" }}>Task info</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ alignSelf: "center" }}>Checklist</Text>
                </View>
            </View>
            <ProgressBar currentStep={0} />
            <View style={{marginTop:8}}>
                <Text style={styles.textMedium}> Task name *</Text>
                <TextInput
                    placeholder="Write name of the task"
                    placeholderTextColor="gray"
                    value={newTask.title}
                    onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                    style={styles.textInput} />
            </View>

            <View>
                <Text style={styles.textMedium}> Date</Text>
                {showCalendar()}
            </View>

            <View style={{ ...styles.row, justifyContent: "flex-start", marginTop: 16 }}>
                <Pressable style={{ ...styles.ingredientCheckbox }}
                    onPress={() => setNewTask({ ...newTask, repeatTask: !newTask.repeatTask })}>
                    {newTask.repeatTask &&
                        <View style={styles.smallCheckbox}>
                            <Ionicons name="checkbox" size={28}></Ionicons>
                        </View>}
                </Pressable>
                <Text style={styles.textMedium}>Repeat task</Text>
            </View>

            <View style={{ ...styles.row, justifyContent: "flex-start", marginTop: 16 }}>
                <Pressable style={{ ...styles.ingredientCheckbox }}
                    onPress={() => setNewTask({ ...newTask, saveTask: !newTask.saveTask })}>
                    {newTask.saveTask &&
                        <View style={styles.smallCheckbox}>
                            <Ionicons name="checkbox" size={28}></Ionicons>
                        </View>}
                </Pressable>
                <Text style={styles.textMedium}>Add to saved tasks</Text>
            </View>

            <View>
                <TouchableOpacity
                    style={[{ ...styles.nextButton, backgroundColor: "gray" }, requiredFieldsFilled && styles.nextButton]}
                    disabled={!requiredFieldsFilled}
                    onPress={() => navigation.navigate("checklistPage")}>
                    <Text style={styles.textNextButton}>Next</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}
