import { HouseholdProvider } from "@/app/context/householdContext";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import LoginPage from "./login";

export default function RootLayout() {
  const [user, setUser] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null; // optional: add spinner

  if (!user) return <LoginPage />;

  return (
    <HouseholdProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </HouseholdProvider>
  );
}
