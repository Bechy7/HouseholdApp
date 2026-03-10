import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeView from "@/app/home/homeView";
import HomeProvider from "../context/homeContext";
import IngredientsPage from "../recipes/newRecipe/ingredientsPage";
import NotesPage from "../recipes/newRecipe/notesPage";
import PreparationPage from "../recipes/newRecipe/preparationPage";
import TagsPage from "../recipes/newRecipe/tagsPage";
import TitlePage from "../recipes/newRecipe/titlePage";
import RecipeView from "../recipes/recipeView";
import ChecklistPage from "../tasks/newTask/checklistPage";
import TaskInfoPage from "../tasks/newTask/taskInfoPage";
import TaskView from "../tasks/taskView";

const Stack = createNativeStackNavigator();

export default function Home() {
    return (
        <HomeProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="homeView" component={HomeView} />
                
                <Stack.Screen name="recipeView" component={RecipeView} />
                <Stack.Screen name="titlePage" component={TitlePage} />
                <Stack.Screen name="ingredientsPage" component={IngredientsPage} />
                <Stack.Screen name="preparationPage" component={PreparationPage} />
                <Stack.Screen name="notesPage" component={NotesPage} />
                <Stack.Screen name="tagsPage" component={TagsPage} />

                <Stack.Screen name="taskView" component={TaskView} />
                <Stack.Screen name="taskInfoPage" component={TaskInfoPage} />
                <Stack.Screen name="checklistPage" component={ChecklistPage} />
            </Stack.Navigator>
        </HomeProvider>
    );
}