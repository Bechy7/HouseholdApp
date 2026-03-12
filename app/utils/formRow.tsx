import React from "react";
import { Platform, StyleSheet, View } from "react-native";

type FormRowProps = {
  children: React.ReactNode;
  spacing?: number;
  maxWidth?: number; // Optional max width on web
};

export default function FormRow({ children, spacing = 12, maxWidth = 600 }: FormRowProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <View
      style={[
        styles.row,
        Platform.OS === "web" ? { maxWidth, width: "100%", marginHorizontal: "auto" } : {},
      ]}
    >
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            marginRight: index < childrenArray.length - 1 ? spacing : 0,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});