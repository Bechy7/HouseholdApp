import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeView from "@/app/home/homeView";
import { Recipe } from "@/app/tabs/recipes";
import RecipeProvider from "../context/recipeContext";
import IngredientsPage from "./newRecipe/ingredientsPage";
import NotesPage from "./newRecipe/notesPage";
import PreparationPage from "./newRecipe/preparationPage";
import TagsPage from "./newRecipe/tagsPage";
import TitlePage from "./newRecipe/titlePage";
import RecipeList from "./recipeList";
import RecipeView from "./recipeView";

const Stack = createNativeStackNavigator();

export default function NewRecipe({ recipe }: { recipe: Recipe }) {
    return (
        <RecipeProvider recipe={recipe}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="recipeList" component={RecipeList} />
                <Stack.Screen name="recipeView" component={RecipeView} />
                <Stack.Screen name="homeView" component={HomeView} />
                <Stack.Screen name="titlePage" component={TitlePage} />
                <Stack.Screen name="ingredientsPage" component={IngredientsPage} />
                <Stack.Screen name="preparationPage" component={PreparationPage} />
                <Stack.Screen name="notesPage" component={NotesPage} />
                <Stack.Screen name="tagsPage" component={TagsPage} />
            </Stack.Navigator>
        </RecipeProvider >
    );
}

