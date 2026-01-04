import { StyleSheet } from "react-native";
import groceries from "./groceries";
import moduls from "./moduls";
import recipe from "./recipe";
import shared from "./shared";

export default StyleSheet.create({
    ...moduls,
    ...shared,
    ...groceries,
    ...recipe,
});
