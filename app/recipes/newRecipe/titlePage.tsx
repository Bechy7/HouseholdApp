import { HomeContext } from "@/app/context/homeContext";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { decode } from "base64-arraybuffer";
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext } from "react";
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../../styles";
import { supabase } from '../../../supabase';
import { RecipeContext } from "../../context/recipeContext";
import ProgressBar from "./progressBar";

type Props = NativeStackScreenProps<any>;

export default function TitlePage({ navigation }: Props) {
    const recipeContext = useContext(RecipeContext);
    const homeContext = useContext(HomeContext);
    if (!recipeContext && !homeContext) return null;
    const { newRecipe, setNewRecipe } = recipeContext || homeContext!;

    const requiredFieldsFilled = newRecipe.title.trim().length > 0;

    const pickAndUpload = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1], // square profile image
        });

        if (result.canceled) return;
        const uri = result.assets[0].uri;

        try {
            const fileName = `Images/${Crypto.randomUUID()}.jpg`;
            let fileData;

            if (Platform.OS === "web") {
                // Web supports blob directly
                const response = await fetch(uri);
                fileData = await response.blob();
            } else {
                // Android/iOS need base64 conversion
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                fileData = decode(base64);
            }

            const { error } = await supabase.storage
                .from("Images")
                .upload(fileName, fileData, {
                    contentType: "image/jpeg",
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from('Images')
                .getPublicUrl(fileName);

            setNewRecipe({ ...newRecipe, imageUrl: data.publicUrl });

        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <View style={styles.modalContainer}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.row}>
                    <Text style={styles.header}>Create a new recipe</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}><Ionicons name="close" size={24} /></TouchableOpacity>
                </View>
                <ProgressBar currentStep={0} />
                <View>
                    <Text style={styles.textMedium}> Name of the recipe</Text>
                    <TouchableOpacity onPress={pickAndUpload}>
                        <Image
                            source={{ uri: newRecipe.imageUrl || "" }}
                            style={styles.addRecipeImage} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.textMedium}> Name of the recipe *</Text>
                    <TextInput
                        placeholder="Write name of the recipe"
                        placeholderTextColor="gray"
                        value={newRecipe.title}
                        onChangeText={(text) => setNewRecipe({ ...newRecipe, title: text })}
                        style={styles.textInput} />
                </View>

                <Text style={styles.textMedium}> Cooking time (min)</Text>
                <TextInput
                    placeholder="23"
                    placeholderTextColor="gray"
                    keyboardType="numeric"
                    value={newRecipe.cookingTime}
                    onChangeText={(text) => {
                        const filteredText = text.replace(/[^0-9]/g, "");
                        setNewRecipe({ ...newRecipe, cookingTime: filteredText })
                    }}
                    style={styles.textInput} />

                <View style={styles.inputRow}>
                    <Text style={{ ...styles.textMedium, flex: 1, marginRight: 12 }}> Portions</Text>
                    <Text style={{ ...styles.textMedium, flex: 1 }}> Calories</Text>
                </View>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="4"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        value={newRecipe.portions}
                        onChangeText={(text) => {
                            const filteredText = text.replace(/[^0-9]/g, "");
                            setNewRecipe({ ...newRecipe, portions: filteredText })
                        }}
                        style={{ ...styles.textInput, marginRight: 12 }} />
                    <TextInput
                        placeholder="550"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        value={newRecipe.calories}
                        onChangeText={(text) => {
                            const filteredText = text.replace(/[^0-9]/g, "");
                            setNewRecipe({ ...newRecipe, calories: filteredText })
                        }}
                        style={styles.textInput} />
                </View>

                <TouchableOpacity
                    style={[{ ...styles.nextButton, backgroundColor: "gray" }, requiredFieldsFilled && styles.nextButton]}
                    disabled={!requiredFieldsFilled}
                    onPress={() => navigation.navigate("ingredientsPage")}>
                    <Text style={styles.textNextButton}>Next</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}