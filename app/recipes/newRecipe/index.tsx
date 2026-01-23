import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Recipe } from "@/app/tabs/recipes";
import RecipeProvider from "../../context/recipeContext";
import IngredientsPage from "./ingredientsPage";
import NotesPage from "./notesPage";
import PreparationPage from "./preparationPage";
import TagsPage from "./tagsPage";
import TitlePage from "./titlePage";


const Stack = createNativeStackNavigator();

export default function NewRecipe({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
    const shouldEdit = recipe.title ? true : false
    return (
        <RecipeProvider recipe={recipe}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="titlePage" component={TitlePage} initialParams={{ onClose }} />
                <Stack.Screen name="ingredientsPage" component={IngredientsPage} initialParams={{ onClose }} />
                <Stack.Screen name="preparationPage" component={PreparationPage} initialParams={{ onClose }} />
                <Stack.Screen name="notesPage" component={NotesPage} initialParams={{ onClose }} />
                <Stack.Screen name="tagsPage" component={TagsPage} initialParams={{ shouldEdit, onClose }} />
            </Stack.Navigator>
        </RecipeProvider >
    );
}

