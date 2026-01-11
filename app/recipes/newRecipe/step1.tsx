import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, View } from "react-native";

type Props = NativeStackScreenProps<any>;

export default function Step1({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Step 1</Text>

      <Button
        title="Next"
        onPress={() => navigation.navigate("Step2")}
      />
    </View>
  );
}
