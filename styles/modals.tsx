import { StyleSheet } from "react-native";

export default StyleSheet.create({
    modal: {
        backgroundColor: "#ffffffff",
        padding: 24,
        justifyContent: "flex-end",
        flex: 1
    },
    modalContainer: {
        width: '100%',
        height: "100%",
        backgroundColor: '#ffffffff',
        padding: 24
    },
    blurredBackground: {
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        position: "absolute",
        opacity: 0.5,
        zIndex: 3
    },

    //Sort and filter
    sortContainer: {
        backgroundColor: "#fff",
        padding: 24,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    sortRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
        marginBottom: 12
    },
    sortTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        alignSelf: "center"
    },
    sortAndFilterRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: -8,
        marginRight: -8,
        alignItems: "center",
        marginTop: 16
    },
    sortAndFilterButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgray",
        marginLeft: 8,
        marginRight: 8,
        flex: 1,
        borderRadius: 16,
        height: 40,
        boxShadow: "2px 2px 2px lightgray"
    },

    //Toast popups
    toast: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: "#2e7d32",
        padding: 12,
        borderRadius: 10,
        zIndex: 1000,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    toastText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});