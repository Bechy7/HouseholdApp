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
    one_row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20
    },
    inputRow: {
        flexDirection: "row",
        marginBottom: 20
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginRight: 10
    },
    scrollView: {
        marginTop: 16
    },
    select: {
        width: 75,
        marginRight: 10
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10
    },
});