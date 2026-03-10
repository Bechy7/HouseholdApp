import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeView from "@/app/home/homeView";
import { emptyRecipeData } from "@/app/tabs/recipes";
import RecipeProvider from "../context/recipeContext";
import IngredientsPage from "../recipes/newRecipe/ingredientsPage";
import NotesPage from "../recipes/newRecipe/notesPage";
import PreparationPage from "../recipes/newRecipe/preparationPage";
import TagsPage from "../recipes/newRecipe/tagsPage";
import TitlePage from "../recipes/newRecipe/titlePage";
import RecipeView from "../recipes/recipeView";

const Stack = createNativeStackNavigator();

export default function Home() {
    return (
        <RecipeProvider recipe={emptyRecipeData}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="homeView" component={HomeView} />
                <Stack.Screen name="recipeView" component={RecipeView} />
                <Stack.Screen name="titlePage" component={TitlePage} />
                <Stack.Screen name="ingredientsPage" component={IngredientsPage} />
                <Stack.Screen name="preparationPage" component={PreparationPage} />
                <Stack.Screen name="notesPage" component={NotesPage} />
                <Stack.Screen name="tagsPage" component={TagsPage} />
            </Stack.Navigator>
        </RecipeProvider >
    );
}