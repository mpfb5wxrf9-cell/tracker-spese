import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setEmailVerified(u?.emailVerified ?? false);
      setLoading(false);
    });
  }, []);

  // Firebase doesn't push emailVerified updates on its own - the user has
  // to reload their token after clicking the link in the verification email.
  async function refreshEmailVerified() {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    const verified = auth.currentUser.emailVerified;
    setEmailVerified(verified);
    return verified;
  }

  return { user, loading, emailVerified, refreshEmailVerified };
}
