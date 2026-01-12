import { createNativeStackNavigator } from "@react-navigation/native-stack";

import IngredientsPage from "./ingredientsPage";
import PreparationPage from "./preparationPage";
import RecipeProvider from "./recipeContext";
import TitlePage from "./titlePage";


const Stack = createNativeStackNavigator();

export default function NewRecipe({ onClose }: { onClose: () => void }) {
    return (
        <RecipeProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="titlePage" component={TitlePage} initialParams={{ onClose }} />
                <Stack.Screen name="ingredientsPage" component={IngredientsPage} initialParams={{ onClose }} />
                <Stack.Screen name="preparationPage" component={PreparationPage} initialParams={{ onClose }} />
            </Stack.Navigator>
        </RecipeProvider >
    );
}

