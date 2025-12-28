import { router } from "expo-router";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";

export default function JoinHousehold() {
    const { householdId, setHouseholdId } = useHousehold();

    const handleJoin = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const householdRef = doc(db, "households", householdId);

        const householdSnap = await getDoc(householdRef);
        if (!householdSnap.exists()) {
            // Optionally show an error or return early
            alert("Household not found.");
            return;
        }
        await updateDoc(householdRef, {
            members: arrayUnion(user.uid),
        });

        router.replace("/tabs/home");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join a Household</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Household ID"
                value={householdId}
                onChangeText={setHouseholdId}
            />
            <Button title="Join" onPress={() => handleJoin()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20 },
});
