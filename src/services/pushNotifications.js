import { arrayRemove, arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { db, messagingPromise } from "../config/firebase";

const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY;

export const registerPushToken = async (uid) => {
  if (!uid) return;
  if (!VAPID_KEY) return;
  if (typeof Notification === "undefined") return;

  if (Notification.permission === "denied") return;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const messaging = await messagingPromise;
  if (!messaging) return;
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) return;

  await setDoc(
    doc(db, "users", uid),
    {
      fcmTokens: arrayUnion(token),
      pushEnabled: true,
      fcmUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const disablePush = async (uid) => {
  if (!uid) return;
  await setDoc(
    doc(db, "users", uid),
    { pushEnabled: false, fcmUpdatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const enablePush = async (uid) => {
  if (!uid) return;
  await setDoc(
    doc(db, "users", uid),
    { pushEnabled: true, fcmUpdatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const clearPushTokens = async (uid) => {
  if (!uid) return;
  await updateDoc(doc(db, "users", uid), { fcmTokens: arrayRemove() });
};
