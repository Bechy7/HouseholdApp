import styles from "@/styles";
import React from "react";
import { View } from "react-native";

const steps = [
    "Day",
    "Week",
    "Month"
];
export default function ProgressBar({
    currentStep,
}: {
    currentStep: number;
}) {
    return (
        <View style={{ padding: 8 }}>
            <View style={styles.barContainer}>
                <View style={[styles.line, currentStep == 0 && styles.buttonLineActive]} />
                <View style={[styles.line, currentStep == 1 && styles.buttonLineActive]} />
                <View style={[styles.line, currentStep == 2 && styles.buttonLineActive]} />
            </View>
        </View>
    );
}