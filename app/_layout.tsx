import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import { auth } from "../firebaseConfig";
import LoginScreen from "./login";

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

  if (!user) return <LoginScreen />;

  return <Slot />; // user is logged in → render tabs
}
