import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const checkIsPro = async () => {

  if (!auth.currentUser) return false;

  const userRef = doc(db, "users", auth.currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return false;

  const user = userSnap.data();

  const isPro =
    user.subscriptionStatus === "active" &&
    new Date(user.subscriptionEnd) > new Date();

  return isPro;
};