import { Colors } from "@/constants/theme";
import styles from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import loginBackground from "../../assets/images/custom/loginBackground.png";
import logo from "../../assets/images/custom/logo.png";
import { auth } from "../../firebaseConfig";

export default function SignupPage({ navigation }: NativeStackScreenProps<any>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("Testsen@hotmail.com");
  const [password, setPassword] = useState("ko28z3FagSGz");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <Text style={styles.textMediumBig}>Create an account</Text>
        </View>
        <View>
          {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}
          <Text style={styles.textMedium}>Name</Text>
          <TextInput
            style={styles.inputLogin}
            placeholder="Type your name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
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
            onPress={handleSignup}>
            <Text style={{ ...styles.textMedium, color: Colors.white }}>{loading ? "Loading..." : "Create Account"}</Text>
          </Pressable>

        </View>
        <View style={{ ...styles.row, justifyContent: "center" }}>
          <Text>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate("loginPage")}>
            <Text style={{ textDecorationLine: 'underline', color: Colors.primary }}>Log in</Text>
          </Pressable>
        </View>

      </View>
    </ImageBackground>

  );
}
