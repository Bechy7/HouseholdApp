import styles from "@/styles";
import React from "react";
import { Text, View } from "react-native";

const steps = [
    "Task info",
    "Checklist",
];
export default function ProgressBar({
    currentStep,
}: {
    currentStep: number;
}) {
    return (
        <View style={styles.container}>
            {/* Labels */}
            <View style={styles.labelsContainer}>
                {steps.map((label, index) => (
                    <Text
                        key={label}
                        style={[
                            styles.label,
                            index <= currentStep && styles.labelActive,
                        ]}
                    >
                        {label}
                    </Text>
                ))}
            </View>

            {/* Progress bar */}
            <View style={styles.barContainer}>
                <View style={[styles.lineActive, { width: `${Math.min(((currentStep / (steps.length - 1)) * 100 + 50), 100)}%` }]} />
                <View style={styles.line} />
            </View>
        </View>
    );
}