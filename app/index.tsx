import { Redirect } from "expo-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

export default function Index() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null; // or a loading spinner
  }

  if (user) {
    return <Redirect href="../household" />;
  }

  return <Redirect href="/login" />;
}
