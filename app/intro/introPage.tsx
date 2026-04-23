import { Colors } from "@/constants/theme";
import styles from "@/styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import logo from "../../assets/images/custom/logo.png";

type Props = NativeStackScreenProps<any>;
export default function IntroPage({ navigation }: Props) {
  return (
    <View style={{ ...styles.introContainer, backgroundColor: Colors.primary }}>
      <View style={{ alignItems: "center", marginTop: 100 }}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={{ ...styles.introText, color: Colors.white, marginBottom: 20 }}>Houziee</Text>
        <Text style={{ color: Colors.white, textAlign: "center" }}>Manage your household with ease, all in one place.</Text>
      </View>

      <TouchableOpacity
        style={styles.introGetStartedButton}
        onPress={() => {
          console.log("Navigation: ", navigation);
          navigation.navigate("welcomePage");
        }}>
        <Text style={styles.textMedium}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}