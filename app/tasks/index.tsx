import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TaskProvider from "../context/taskContext";
import { Task } from "../tabs/tasks";
import ChecklistPage from "./newTask/checklistPage";
import TaskInfoPage from "./newTask/taskInfoPage";
import TaskList from "./taskList";
import TaskView from "./taskView";

const Stack = createNativeStackNavigator();

export default function TaskIndex({ task }: { task: Task }) {
    return (
        <TaskProvider task={task}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="taskList" component={TaskList} />
                <Stack.Screen name="taskView" component={TaskView} />
                <Stack.Screen name="taskInfoPage" component={TaskInfoPage} />
                <Stack.Screen name="checklistPage" component={ChecklistPage} />
            </Stack.Navigator>
        </TaskProvider >
    );
}
