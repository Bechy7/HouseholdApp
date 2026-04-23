import { Colors } from "@/constants/theme";
import styles from "@/styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import householdBackground from "../../../assets/images/custom/householdBackground.png";
import logo from "../../../assets/images/custom/logo.png";

type Props = NativeStackScreenProps<any>;
export default function SetupHouseholdPage({ navigation }: Props) {
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
        <View>
          <Text style={{ ...styles.textMediumBig, textAlign: "center", marginBottom: 16 }}>Set up your household</Text>
          <Text style={{ textAlign: "center", marginBottom: 60 }}>Before you can finish signing up, you need to be part of an household. Choose whether to join an existing household or create a new one.</Text>

          <Pressable
            style={{ ...styles.nextButton, backgroundColor: Colors.primary, marginTop: 16 }}
            onPress={() => navigation.navigate("createHouseholdPage")}>
            <Text style={{ ...styles.textMedium, color: Colors.white }}>Create a Household</Text>
          </Pressable>

          <Pressable
            style={{ ...styles.nextButton, backgroundColor: Colors.white, marginTop: 16, borderColor: Colors.primary, borderWidth: 2 }}
            onPress={() => navigation.navigate("joinHouseholdPage")}>
            <Text style={{ ...styles.textMedium, color: Colors.primary }}>Join a Household</Text>
          </Pressable>

        </View>
      </View>
    </ImageBackground>
  );
}
