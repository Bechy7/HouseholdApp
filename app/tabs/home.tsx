import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../../firebaseConfig";

export default function HomePage() {
    const handleLogout = async () => {
        await auth.signOut();
    };

    return (
        <View style={styles.container}>
            <Button title="Logout" onPress={handleLogout} />

            <Text style={styles.header}>Home</Text>
            <Text style={styles.text}>Welcome to Luciepoo and Svenjapoo's Household App. Hope it will bring you comfort and joy to your household!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    text: { fontSize: 16, marginBottom: 10 },
    inputRow: { flexDirection: "row", marginBottom: 20 },
    input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginRight: 10 },
    noteRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
    note: { fontSize: 18 },
});
