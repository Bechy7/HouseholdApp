import { Colors } from "@/constants/theme";
import styles from "@/styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import logo from "../../assets/images/custom/logo.png";
import welcomeBackground from "../../assets/images/custom/welcomeBackground.png";

type Props = NativeStackScreenProps<any>;
export default function WelcomePage({ navigation }: Props) {
  return (
    <ImageBackground source={welcomeBackground} style={styles.backgroundImage}>
      <View style={styles.introContainer}>
        <View style={{alignItems: "center"}}>
          <Image
            source={logo}
            style={styles.introLogo}
            resizeMode="contain"
          />
          <Text style={{ ...styles.textMedium, textAlign: "center" }}>Welcome to</Text>
          <Text style={{ ...styles.introText, marginBottom: 20 }}>Houziee!</Text>
          <Text style={{ textAlign: "center" }}>Organize tasks, chores, plan meals, and manage your shopping lists.</Text>
        </View>

        <View style={{ justifyContent: "flex-end", alignContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.introPrimaryButton}
            onPress={() => navigation.navigate("signupPage")}>
            <Text style={{...styles.textMedium, color: Colors.white}}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.introSecondaryButton}
            onPress={() => navigation.navigate("loginPage")}>
            <Text style={{...styles.textMedium, color: Colors.primary}}>Log In</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}
