import useHousehold from "@/app/context/householdContext";
import { Colors } from "@/constants/theme";
import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Image, ImageBackground, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import householdBackground from "../../../assets/images/custom/householdBackground.png";
import logo from "../../../assets/images/custom/logo.png";
import { auth, db } from "../../../firebaseConfig";

type Props = NativeStackScreenProps<any>;
export default function CreateHouseholdPage({ navigation }: Props) {
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
        <ImageBackground source={householdBackground} style={styles.backgroundImage}>
            <View style={{ ...styles.introContainer, justifyContent: "flex-start" }}>
                <View style={{ ...styles.row, justifyContent: "center", marginBottom: 40 }}>
                    <Image
                        source={logo}
                        style={styles.logoMini}
                        resizeMode="contain"
                    />
                    <Text style={styles.textMedium}>Houziee</Text>
                </View>
                <Pressable
                    style={{ ...styles.mediumRoundButton, backgroundColor: Colors.primary, marginBottom: 16 }}
                    onPress={() => { navigation.goBack() }}
                >
                    <Ionicons style={{ color: "white" }} name="arrow-back" size={16} />
                </Pressable>
                <View>
                    <Text style={{ ...styles.textMediumBig, textAlign: "center", marginBottom: 16 }}>Create a Household</Text>
                    <Text style={{ textAlign: "center", marginBottom: 60 }}>See your household’s week plan, shared tasks, and upcoming events — all in one place.</Text>

                    <Text>Household name</Text>
                    <TextInput
                        style={styles.inputLogin}
                        placeholder="Create a name for your household"
                        value={name}
                        onChangeText={setName}
                    />
                    <Pressable
                        style={{ ...styles.nextButton, backgroundColor: Colors.primary, marginTop: 16 }}
                        onPress={() => handleCreate()}>
                        <Text style={{ ...styles.textMedium, color: Colors.white }}>Create Household</Text>
                    </Pressable>

                </View>
            </View>
            <Modal style={styles.modal}
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={{ ...styles.textMediumBig, textAlign: "center" }}>Invite Your Household members</Text>
                    <Text style={{ textAlign: "center", marginBottom: 60 }} >Share your household code with members so they can join your household and access shared plans, tasks, and events.</Text>
                    <Text >Your household code</Text>
                    <View style={{ ...styles.row, marginBottom: 20 }}>
                        <TextInput style={{ ...styles.inputLogin, fontWeight: '600' }} value={householdId} editable={false} />
                        <Pressable style={{ ...styles.inputLogin, marginHorizontal: 12, flex: 1 }}>
                            <Text style={styles.textMedium}>Copy</Text>
                        </Pressable>
                        <Pressable style={styles.inputLogin}>
                            <Ionicons style={styles.textMedium} name="share-outline" size={16} />
                        </Pressable>
                    </View>
                    <View>
                        <TouchableOpacity style={{ ...styles.nextButton, backgroundColor: Colors.primary }} onPress={() => router.replace("/tabs/home")}><Text style={{ ...styles.textMedium, color: Colors.white }}>Done</Text></TouchableOpacity>
                    </View>
                    <Text style={{ textAlign: "center", marginBottom: 20 }}>You can share your household code anytime and manage members permissions from Household Settings.</Text>
                </View>

            </Modal>

        </ImageBackground>

    );
}
