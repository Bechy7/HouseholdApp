import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Recipe } from "@/app/tabs/recipes";
import RecipeProvider from "../../context/recipeContext";
import RecipeList from "../recipeList";
import RecipeView from "../recipeView";
import IngredientsPage from "./ingredientsPage";
import NotesPage from "./notesPage";
import PreparationPage from "./preparationPage";
import TagsPage from "./tagsPage";
import TitlePage from "./titlePage";

const Stack = createNativeStackNavigator();

export default function NewRecipe({ recipe }: { recipe: Recipe }) {
    const shouldEdit = recipe.title ? true : false
    return (
        <RecipeProvider recipe={recipe}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="recipeList" component={RecipeList} />
                <Stack.Screen name="recipeView" component={RecipeView} />
                <Stack.Screen name="titlePage" component={TitlePage} />
                <Stack.Screen name="ingredientsPage" component={IngredientsPage} />
                <Stack.Screen name="preparationPage" component={PreparationPage} />
                <Stack.Screen name="notesPage" component={NotesPage} />
                <Stack.Screen name="tagsPage" component={TagsPage} initialParams={{ shouldEdit }} />
            </Stack.Navigator>
        </RecipeProvider >
    );
}

