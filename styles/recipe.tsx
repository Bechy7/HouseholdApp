import { StyleSheet } from "react-native";

export default StyleSheet.create({
    recipeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
        backgroundColor: "white",
        marginBottom: 12,
        borderRadius: 16,
        boxShadow: "2px 2px 2px lightgray",
        height: 75
    },
    searchRecipe: {
        flexDirection: "row",
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 16,
        boxShadow: "2px 2px 2px lightgray",
        paddingLeft: 8,
        height: 40
    },
    addToCalenderButton: {
        margin: 16,
        backgroundColor: "lightgray",
        alignItems: "center",
        borderRadius: 24,
        boxShadow: "2px 2px 2px lightgray",
        width: 24,
        height: 24,
        justifyContent: "center",
    },
    openRecipeModuleButton: {
        padding: 12,
        backgroundColor: "#ffffffff",
        alignItems: "center",
        borderRadius: 20,
        boxShadow: "2px 2px 2px lightgray",
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    addRecipeNextButton: {
        flex: 1,
        padding: 12,
        backgroundColor: "gray",
        alignItems: "center",
        marginTop: 48,
        borderRadius: 16
    },
    addRecipeBackButton: {
        flex: 1,
        padding: 12,
        alignItems: "center",
        marginTop: 48,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: 8
    },
    addIngredientButton: {
        flex: 1,
        padding: 12,
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 1,
        marginRight: 8,
        backgroundColor: "#806752"
    },

    ingredientRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5
    },
    RecipeListImage: {
        width: 75,
        height: 75,
        marginRight: 12,
        backgroundColor: "lightgray",
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16
    },
    addRecipeImage: {
        width: "100%",
        height: 224,
        borderRadius: 16,
        backgroundColor: "lightgray",
        marginVertical: 12
    }
});