import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    introContainer: {
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    introLogo: {
        width: 156,
        height: 156,
        marginBottom: 20,
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
});