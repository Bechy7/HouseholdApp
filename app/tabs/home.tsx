import React from "react";
import styles from "../../style/style"
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


