import useHousehold from "@/app/context/householdContext";
import { Colors } from "@/constants/theme";
import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { router } from "expo-router";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { Image, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import householdBackground from "../../../assets/images/custom/householdBackground.png";
import logo from "../../../assets/images/custom/logo.png";
import { auth, db } from "../../../firebaseConfig";


type Props = NativeStackScreenProps<any>;
export default function JoinHouseholdPage({ navigation }: Props) {
    const { householdId, setHouseholdId } = useHousehold();

    const handleJoin = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const householdRef = doc(db, "households", householdId);

        const householdSnap = await getDoc(householdRef);
        if (!householdSnap.exists()) {
            alert("Household not found.");
            return;
        }
        await updateDoc(householdRef, {
            members: arrayUnion(user.uid),
        });

        router.replace("/tabs/home");
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
                    <Text style={{ ...styles.textMediumBig, textAlign: "center", marginBottom: 16 }}>Join a Household</Text>
                    <Text style={{ textAlign: "center", marginBottom: 60 }}>Ask a family member who already created the household for the code and enter it below to join.</Text>

                    <Text>Household code</Text>
                    <TextInput
                        style={styles.inputLogin}
                        placeholder="Enter Household code"
                        value={householdId}
                        onChangeText={setHouseholdId}
                    />
                    <Pressable
                        style={{ ...styles.nextButton, backgroundColor: Colors.primary, marginTop: 16 }}
                        onPress={() => handleJoin()}>
                        <Text style={{ ...styles.textMedium, color: Colors.white }}>Join Household</Text>
                    </Pressable>
                </View>


            </View>
            <View style={{ position: "absolute", bottom: 44, width: "100%" }}>
                <Text style={{ textAlign: "center", marginBottom: 4 }}>Don’t know how to get a household code? </Text>
                <Pressable>
                    <Text style={{ textAlign: "center", textDecorationLine: 'underline', color: Colors.primary }}>Click here for instructions.</Text>
                </Pressable>
            </View>


        </ImageBackground>
    );
}
