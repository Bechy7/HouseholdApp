import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import useHousehold from "../context/householdContext";

export default function CreateHouseholdScreen() {
    const [name, setName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const { householdId, setHouseholdId } = useHousehold();

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter a household name");
            return;
        }

        try {
            // ✅ Ensure user is signed in
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "You must be logged in");
                return;
            }

            // ✅ Add household with user as member
            const docRef = await addDoc(collection(db, "households"), {
                name: name,
                members: [user.uid],
                createdAt: new Date(),
            });

            // Show invite code (household ID = docRef.id)
            setHouseholdId(docRef.id);
            setModalVisible(true);
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a Household</Text>
            <TextInput
                style={styles.input}
                placeholder="Household name"
                value={name}
                onChangeText={setName}
            />
            <Button title="Create" onPress={handleCreate} />
            <Modal style={styles.modal}
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal_container}>
                    <Text style={styles.title}>Invite Your Household members</Text>
                    <Text style={styles.text}>Share your household code with members so they can join your household and access shared plans, tasks, and events.</Text>
                    <Text style={styles.text}>Your household code</Text>
                    <Text style={{ fontSize: 18, marginVertical: 20, textAlign: "center", fontWeight: "bold" }}>{householdId}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.replace("/tabs/home")}><Text>Done</Text></TouchableOpacity>
                    <Text style={{ textAlign: "center", marginBottom: 20 }}>You can share your household code anytime manage members permissions from Household Settings.</Text>
                </View>

            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
    text: { fontSize: 14, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    modal:{backgroundColor: "#ffffffff", padding:24},
    closeButton:{padding:12},
    modal_container:{width: '100%', height:"100%", backgroundColor: '#ffffffff', padding: 24},
    addButton:{padding:12, backgroundColor: "#E0E0E0", alignItems:"center"},
});
