import { StyleSheet } from "react-native";
import groceries from "./groceries";
import intro from "./intro";
import modals from "./modals";
import progressBar from "./progressBar";
import recipe from "./recipe";
import shared from "./shared";

export default StyleSheet.create({
    ...modals,
    ...shared,
    ...groceries,
    ...recipe,
    ...progressBar,
    ...intro
});
