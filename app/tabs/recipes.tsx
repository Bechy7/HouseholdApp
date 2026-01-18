import React from "react";
import RecipesList from "../recipes/recipeList";

export const emptyRecipeData = { title: "", id: "", householdId: "", ingredients: [], preparationSteps: [], notes: [], tags: [], calories: "", cookingTime:"", portions:"" }

export type Recipe = {
    id: string;
    createdAt?: any;
    title: string;
    householdId: string;
    ingredients: Ingredient[];
    cookingTime?: string;
    portions?: string;
    calories?: string;
    preparationSteps: string[];
    notes: string[];
    tags: Tag[];
};

export type Ingredient = {
    title: string;
    storePref?: string;
    quantity?: string;
    unit?: string
}

export type Tag = {
    category: string,
    tags: string[],
}

export default function RecipesPage() {
    return <RecipesList />;
}