import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const createNotification = async ({
  uid,
  title,
  message,
  type,
  projectId = null,
  taskId = null,
}) => {
  if (!uid) return;

  await addDoc(collection(db, "users", uid, "notifications"), {
    title,
    message,
    type,
    projectId,
    taskId,
    read: false,
    createdAt: serverTimestamp(),
  });
};

export const createNotificationsForUids = async ({ uids, ...payload }) => {
  const uniqueUids = Array.from(new Set(uids.filter(Boolean)));
  await Promise.all(uniqueUids.map((uid) => createNotification({ uid, ...payload })));
};
