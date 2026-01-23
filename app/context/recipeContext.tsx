import availableTags from "@/app/helpers/availableTags";
import { Recipe } from "@/app/tabs/recipes";
import { createContext, useState } from "react";

export const RecipeContext = createContext<{ newRecipe: Recipe; setNewRecipe: (newRecipe: Recipe) => void } | undefined>(undefined);

const RecipeProvider = ({ recipe, children }: { recipe: Recipe; children: React.ReactNode }) => {
    const [newRecipe, setNewRecipe] = useState<Recipe>(recipe);

    const [initialized, setInitialized] = useState(false);

    if (!initialized && !recipe.title) {
        availableTags.forEach(tag => {
            newRecipe.tags.push({ category: tag.category, tags: [] })
        });
        setNewRecipe({ ...newRecipe });
        setInitialized(true);
    }


    return (
        <RecipeContext.Provider value={{ newRecipe, setNewRecipe }}>
            {children}
        </RecipeContext.Provider>
    )
}

export default RecipeProvider;