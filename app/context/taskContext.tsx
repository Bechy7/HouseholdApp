import { createContext, useState } from "react";
import { Task } from "../tabs/tasks";

export const TaskContext = createContext<{ newTask: Task; setNewTask: (newTask: Task) => void } | undefined>(undefined);

const TaskProvider = ({ task, children }: { task: Task; children: React.ReactNode }) => {
    const [newTask, setNewTask] = useState<Task>(task);

    return (
        <TaskContext.Provider value={{ newTask, setNewTask }}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskProvider;