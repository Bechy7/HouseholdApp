import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { Platform, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import ProgressBar from "./progressBar";
import { TaskContext } from "./taskContext";

type Props = NativeStackScreenProps<any>;

export default function TaskInfoPage({ navigation }: Props) {
    const taskContext = useContext(TaskContext);
    if (!taskContext) return null;
    const { newTask, setNewTask } = taskContext;
    const [date, setDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [repeatTask, setRepeatTask] = useState(false);
    const [addSavedTasks, setAddSavedTasks] = useState(false);

    const route = useRoute();
    const { onClose } = (route.params as { onClose: () => void }) || { onClose: () => { } };
    const requiredFieldsFilled = newTask.title.trim().length > 0;

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const showCalendar = () => {
        // ---------- WEB ----------
        if (Platform.OS === "web") {
            return (
                <input
                    type="date"
                    value={date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(new Date(e.target.value))}
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
                        value={date ? formatDate(date) : ""}
                        style={{
                            borderWidth: 1,
                            padding: 12,
                            borderRadius: 6,
                        }}
                    />
                </Pressable>

                {showPicker && (
                    <DateTimePicker
                        value={date ?? new Date()}
                        mode="date"
                        display="default"
                        onChange={(_, selectedDate) => {
                            setShowPicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}
            </View>
        );
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <Text style={styles.header}>Create a task</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}><Ionicons name="close" size={24} /></TouchableOpacity>
            </View>
            <ProgressBar currentStep={0} />
            <View>
                <Text style={styles.textMedium}> Name of the recipe *</Text>
                <TextInput
                    placeholder="Write name of the recipe"
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
