import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    introContainer: {
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    logo: {
        width: 156,
        height: 156,
        marginBottom: 20,
    },
    logoMini: {
        width: 32,
        height: 32,
        marginRight: 8
    },
    introText: {
        fontSize: 36,
        fontWeight: "700",
        textAlign: "center",
    },
    introGetStartedButton: {
        backgroundColor: Colors.white,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: "center",
    },
    introPrimaryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    introSecondaryButton: {
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: "center",
    },
    inputLogin: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 12,
        padding: 10,
        marginBottom: 16,
        backgroundColor: "white",
        marginVertical: 8
    },
});