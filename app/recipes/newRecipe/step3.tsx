import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, View } from "react-native";

type Props = NativeStackScreenProps<any>;

export default function Step3({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Step 3</Text>

      <Button title="Back" onPress={navigation.goBack} />
      <Button title="Finish" onPress={() => alert("Done!")} />
    </View>
  );
}
