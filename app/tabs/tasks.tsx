import { Timestamp } from "firebase/firestore";
import TaskList from "../tasks/taskList";

export type Task = {
    id: string;
    householdId: string;
    title: string;
    date?: Timestamp;
    checklist: Checklist[];
    repeatTask: boolean;
    saveTask: boolean;
    finished: boolean;
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
