import React from "react";
import RecipesList from "../recipes/recipeList";

export type Recipe = {
    id: string;
    createdAt?: any;
    title: string;
    householdId: string;
    ingredients: Ingredient[];
    description?: string;
    cookingTime?: string;
    portions?: string;
    calories?: string;
};

export type Ingredient = {
    title: string;
    storePref?: string;
    quantity?: string;
    unit?: string
}

export default function RecipesPage() {
    return <RecipesList />;
}