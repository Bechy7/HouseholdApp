import { Colors } from "@/constants/theme";
import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import loginBackground from "../../assets/images/custom/loginBackground.png";
import logo from "../../assets/images/custom/logo.png";
import { auth } from "../../firebaseConfig";

export default function LoginPage({ navigation }: NativeStackScreenProps<any>) {
  const [email, setEmail] = useState("Testsen@hotmail.com");
  const [password, setPassword] = useState("ko28z3FagSGz");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      navigation.navigate("householdPage");
    }
  };

  return (
    <ImageBackground source={loginBackground} style={styles.backgroundImage}>
      <View style={styles.introContainer}>
        <View>
          <View style={{ ...styles.row, justifyContent: "center", marginBottom: 40 }}>
            <Image
              source={logo}
              style={styles.logoMini}
              resizeMode="contain"
            />
            <Text style={styles.textMedium}>Houziee</Text>
          </View>
          <Pressable
            style={{ ...styles.mediumRoundButton, backgroundColor: Colors.white, marginBottom: 16 }}
            onPress={() => { navigation.navigate("welcomePage") }}
          >
            <Ionicons style={{ color: "black" }} name="arrow-back" size={16} />
          </Pressable>
          <Text style={styles.textMediumBig}>Log in</Text>
        </View>
        <View>
          {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}
          <Text style={styles.textMedium}>Email</Text>
          <TextInput
            style={styles.inputLogin}
            placeholder="Type your email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <Text style={styles.textMedium}>Password</Text>
          <TextInput
            style={styles.inputLogin}
            placeholder="Type your password"
            placeholderTextColor="gray"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            style={{ ...styles.nextButton, backgroundColor: Colors.primary, marginTop: 16 }}
            onPress={handleLogin}>
            <Text style={{ ...styles.textMedium, color: Colors.white }}>{loading ? "Loading..." : "Log in"}</Text>
          </Pressable>

        </View>
        <View style={{ ...styles.row, justifyContent: "center" }}>
          <Text>Don't have an account yet? </Text>
          <Pressable onPress={() => navigation.navigate("signupPage")}>
            <Text style={{ textDecorationLine: 'underline', color: Colors.primary }}>Sign Up</Text>
          </Pressable>
        </View>

      </View>
    </ImageBackground>

  );
}
