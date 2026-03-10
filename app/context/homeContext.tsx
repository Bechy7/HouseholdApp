import { emptyRecipeData, Recipe } from "@/app/tabs/recipes";
import { createContext, useState } from "react";
import { emptyTaskData, Task } from "../tabs/tasks";

export const HomeContext = createContext<{ newRecipe: Recipe; newTask: Task; setNewRecipe: (newRecipe: Recipe) => void; setNewTask: (newTask: Task) => void } | undefined>(undefined);

const HomeProvider = ({ children }: { children: React.ReactNode }) => {
    const [newRecipe, setNewRecipe] = useState<Recipe>(emptyRecipeData);
    const [newTask, setNewTask] = useState<Task>(emptyTaskData);

    return (
        <HomeContext.Provider value={{ newRecipe, newTask, setNewRecipe, setNewTask }}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeProvider;