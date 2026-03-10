import { Timestamp } from "firebase/firestore";
import React from "react";
import NewRecipe from "../recipes";

export const emptyRecipeData = { title: "", id: "", householdId: "", ingredients: [], preparationSteps: [], notes: [], tags: [], calories: "", cookingTime: "", portions: "", imageUrl: "" }

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
    imageUrl?: string;
};

export type Meal = {
    id: string;
    householdId: string;
    recipeId: string;
    title: string;
    cookingTime?: string;
    date: Timestamp;
    imageUrl?: string;
}

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
    return <NewRecipe recipe={emptyRecipeData} />;
}