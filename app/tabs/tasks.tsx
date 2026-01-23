import { Timestamp } from "firebase/firestore";
import TaskList from "../tasks/taskList";

export const emptyTaskData: Task = { id: "", title: "", checklist: [], householdId: "", repeatTask: false, saveTask: false, finished: false}

export type Task = {
    id: string;
    householdId: string;
    title: string;
    checklist: Checklist[];
    repeatTask: boolean;
    saveTask: boolean;
    finished: boolean;
    date?: Timestamp;
}

export type PlannedTask = {
    id: string;
    householdId: string;
    title: string;
    taskId: string;
    date: Timestamp;
}

export type Checklist = {
    title: string;
    category?: string;
}

export default function TasksPage() {

    return (
        <TaskList />
    );
}
