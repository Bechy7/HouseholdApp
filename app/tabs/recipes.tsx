import React from "react";
import RecipesList from "../recipes/recipeList";

export type Recipe = {
    id: string;
    createdAt?: any;
    title: string;
    householdId: string;
    ingredients: { title: string; storePref: string }[];
    description?: string;
    cookingTime?: string;
    portions?: string;
    calories?: string;
};

export default function RecipesPage() {
    return <RecipesList />;
}