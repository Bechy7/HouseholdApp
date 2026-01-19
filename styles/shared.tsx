import { StyleSheet } from "react-native";

export default StyleSheet.create({
    checkbox: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    buttonRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    roundButton: {
        borderRadius: 20,
        backgroundColor: "white",
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
        marginHorizontal: 4
    },
    closeButton: {
        alignSelf: "flex-end",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 16,
        boxShadow: "2px 2px 2px lightgray",
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f4f6f7",
        paddingTop: 50
    },
    header: {
        fontSize: 24,
    },
    infoBox: {
        flex: 1,
        alignItems: "flex-start",
        padding: 8,
        backgroundColor: "white",
        marginBottom: 12,
        marginRight: 16,
        borderRadius: 16,
        boxShadow: "2px 2px 2px lightgray",
        height: 88
    },
    recipeBox: {
        padding: 16,
        backgroundColor: "white",
        marginBottom: 24,
        borderRadius: 16,
        boxShadow: "2px 2px 2px lightgray",
    },
    inputRow: {
        flexDirection: "row",
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 16,
        padding: 10,
        marginRight: 10,
        backgroundColor: "white",
        marginVertical: 8
    },
    nextButton: {
        flex: 1,
        padding: 12,
        backgroundColor: "#4e4e4e",
        alignItems: "center",
        marginTop: 48,
        borderRadius: 16
    },
    roundDeleteButton: {
        backgroundColor: "lightgray",
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start"
    },
    roundStepCounter: {
        backgroundColor: "lightgray",
        borderRadius: 16,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start"
    },
    scrollView: {
        marginTop: 16
    },
    select: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#000000ff",
        borderRadius: 24,
        overflow: "hidden",
        fontSize: 16,
        backgroundColor: "#fff",
        padding: 12,
        width: "100%",
        marginRight: 0,
        marginBottom: 11,
        marginTop: 10
    },
    saveButton: {
        marginVertical: 24,
        backgroundColor: "#806752",
        borderRadius: 16,
        height: 48,
        alignItems: "center",
        justifyContent: "center"
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#000000ff",
        borderRadius: 20,
        padding: 12,
        overflow: "hidden",
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: "#fff",
        marginVertical: 12,
        width: "100%",
        height: 44
    },
    textMedium: {
        fontSize: 16,
        fontWeight: 600
    },
    textNextButton: {
        fontSize: 16,
        fontWeight: 600,
        color: "white"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10
    },
    ingredientCheckbox: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 6,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    quantityRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "white"
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    valueBox: {
        height: 40,
        marginHorizontal: 10,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    inner: {
        width: 12,
        height: 12,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center"
    },
});