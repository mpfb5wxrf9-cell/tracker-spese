import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Enables offline caching (IndexedDB) so the app still works without a
// connection and syncs automatically once back online.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
