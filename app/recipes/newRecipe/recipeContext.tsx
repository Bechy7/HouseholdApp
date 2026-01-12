import { Recipe } from "@/app/tabs/recipes";
import { createContext, useState } from "react";


export const RecipeContext = createContext<{ newRecipe: Recipe; setNewRecipe: (newRecipe: Recipe) => void } | undefined>(undefined);

const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
    const [newRecipe, setNewRecipe] = useState<Recipe>({ id: "", title: "", ingredients: [], householdId: "", preparationSteps: [] });

    return (
        <RecipeContext.Provider value={{newRecipe, setNewRecipe}}>
            {children}
        </RecipeContext.Provider>
    )
}

export default RecipeProvider;