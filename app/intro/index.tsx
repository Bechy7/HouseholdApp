import { createNativeStackNavigator } from "@react-navigation/native-stack";


import IntroProvider from "../context/introContext";
import IntroPage from "./introPage";
import LoginPage from "./loginPage";
import SignupPage from "./signupPage";
import WelcomePage from "./welcomePage";

const Stack = createNativeStackNavigator();

export default function IntroIndex() {
    return (
        <IntroProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="introPage" component={IntroPage} />
                <Stack.Screen name="welcomePage" component={WelcomePage} />
                <Stack.Screen name="loginPage" component={LoginPage} />
                <Stack.Screen name="signupPage" component={SignupPage} />
            </Stack.Navigator>
        </IntroProvider>
    );
}