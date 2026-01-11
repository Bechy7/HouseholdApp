import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, View } from "react-native";

type Props = NativeStackScreenProps<any>;

export default function Step2({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Step 2</Text>

      <Button title="Back" onPress={navigation.goBack} />
      <Button
        title="Next"
        onPress={() => navigation.navigate("Step3")}
      />
    </View>
  );
}
