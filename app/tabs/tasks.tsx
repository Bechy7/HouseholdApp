import TaskList from "../tasks/taskList";

export type Task = {
    id: string;
    householdId: string;
    title: string;
    date?: Date;
    checklist: Checklist[];
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
