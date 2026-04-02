import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { color: 'white' }
        , tabBarStyle: {
          backgroundColor: "#6D3D14",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 56,
          position: "absolute",
          overflow: "hidden",
        }
      }}
    >

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ size }) => (
            <Ionicons name="home" color="white" size={size} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: 12, fontWeight: focused ? "bold" : "normal" }}>
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ size }) => (
            <Ionicons name="fast-food-sharp" color="white" size={size} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: 12, fontWeight: focused ? "bold" : "normal" }}>
              Recipes
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: "Groceries",
          tabBarIcon: ({ size }) => (
            <Ionicons name="document-text" color="white" size={size} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: 12, fontWeight: focused ? "bold" : "normal" }}>
              Groceries
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "tasks",
          tabBarIcon: ({ size }) => (
            <Ionicons name="paper-plane" color="white" size={size} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: 12, fontWeight: focused ? "bold" : "normal" }}>
              Tasks
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
