import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Recipe } from "@/app/tabs/recipes";
import { createContext, useContext, useState } from "react";
import IngredientsPage from "./ingredientsPage";
import TitlePage from "./titlePage";

const Stack = createNativeStackNavigator();

export default function NewRecipe({ onClose }: { onClose: () => void }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Step1" component={TitlePage} initialParams={{ onClose }} />
            <Stack.Screen name="Step2" component={IngredientsPage} initialParams={{ onClose }} />
        </Stack.Navigator>
    );
}

