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
    inputRow: {
        flexDirection: "row",
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
        marginLeft: 12,
        marginBottom: 11,
        marginTop: 10
    },
    textInput: {
        flex: 1,
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
        height: 40
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
});