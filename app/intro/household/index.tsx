import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HouseholdScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Household</Text>
      <Button title="Create Household" onPress={() => router.push("/household/create")} />
      <Button title="Join Household" onPress={() => router.push("/household/join")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
});
