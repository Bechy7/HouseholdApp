import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Task } from "../../tabs/tasks";
import ChecklistPage from "./checklistPage";
import TaskProvider from "../../context/taskContext";
import TaskInfoPage from "./taskInfoPage";


const Stack = createNativeStackNavigator();

export default function NewTask({ task, onClose }: { task: Task; onClose: () => void }) {
    const shouldEdit = task.title ? true : false
    return (
        <TaskProvider task={task}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="taskInfoPage" component={TaskInfoPage} initialParams={{ onClose }} />
                <Stack.Screen name="checklistPage" component={ChecklistPage} initialParams={{ onClose, shouldEdit }} />
            </Stack.Navigator>
        </TaskProvider >
    );
}

