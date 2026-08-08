import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useFirestoreCollection<T extends { id: string }>(
  uid: string | undefined,
  collectionName: string,
) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    if (!uid) {
      setItems([]);
      return;
    }
    const ref = collection(db, "users", uid, collectionName);
    return onSnapshot(ref, (snapshot) => {
      setItems(snapshot.docs.map((d) => d.data() as T));
    });
  }, [uid, collectionName]);

  function add(item: T) {
    if (!uid) return;
    void setDoc(doc(db, "users", uid, collectionName, item.id), item);
  }

  function remove(id: string) {
    if (!uid) return;
    void deleteDoc(doc(db, "users", uid, collectionName, id));
  }

  return { items, add, remove };
}
