import { StyleSheet } from "react-native";

export default StyleSheet.create({
    groceryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5
    },
    suggestions: {
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    suggestion: {
        paddingVertical: 8,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
});