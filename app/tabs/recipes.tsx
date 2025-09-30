import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import styles from "../../style/style";


export default function RecipesPage() {
    const [modalVisible, setModalVisible] = useState(false);
    const [newRecipe, setNewRecipe] = useState("");

    const addRecipe = async () => {
        const user = auth.currentUser;
        console.log(newRecipe.trim());
        if (!user || !newRecipe.trim()) return;
        console.log("here");
        await addDoc(collection(db, "recipes"), {
            title: newRecipe.trim(),
        });

        setNewRecipe("");
    };
    return (
        <View style={styles.container}>
            <View style={styles.one_row}>
                <Text style={styles.header}>Recipes</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}><Ionicons name="add" size={24} /></TouchableOpacity>
            </View>
            <Modal style={styles.modal}
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal_container}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} /></TouchableOpacity>
                    <TextInput
                        placeholder="Enter recipe name"
                        onChangeText={setNewRecipe}
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 }} />
                    <TouchableOpacity style={styles.addButton} onPress={addRecipe}><Text>Save recipe</Text></TouchableOpacity>
                </View>

            </Modal>

        </View>


    )
}


