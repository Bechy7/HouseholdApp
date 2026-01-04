import { Recipe } from "../tabs/recipes";

export default [
    { title: "Newest" },
    { title: "Alphabetical (A → Z)" },
    { title: "Alphabetical (Z → A)" },
    { title: "Most popular" },
    { title: "Quickest" },
]

export const sortMethod = (sortTitle: string, recipes: Recipe[]) => {
    const sortedRecipes = [...recipes];
    switch (sortTitle) {
        case "Newest":
            return sortedRecipes.sort((a, b) => b.createdAt - a.createdAt);
        case "Alphabetical (A → Z)":
            return sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
        case "Alphabetical (Z → A)":
            return sortedRecipes.sort((a, b) => b.title.localeCompare(a.title));
        case "Most popular":
            // return sortedRecipes.sort((a, b) => b.popularity - a.popularity);
        case "Quickest":
            // return sortedRecipes.sort((a, b) => a.prepTime - b.prepTime);
        default:
            return sortedRecipes;
    }
}