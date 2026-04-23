import { createNativeStackNavigator } from "@react-navigation/native-stack";


import IntroProvider from "../context/introContext";
import CreateHouseholdPage from "./household/createHouseholdPage";
import JoinHouseholdPage from "./household/joinHouseholdPage";
import SetupHouseholdPage from "./household/setupHouseholdPage";
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
                <Stack.Screen name="householdPage" component={SetupHouseholdPage} />
                <Stack.Screen name="joinHouseholdPage" component={JoinHouseholdPage} />
                <Stack.Screen name="createHouseholdPage" component={CreateHouseholdPage} />
            </Stack.Navigator>
        </IntroProvider>
    );
}