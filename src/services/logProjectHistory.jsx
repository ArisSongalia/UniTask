import { db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";


export const logProjectHistory = async ({ projectId, action, actionId, actionType = '', userDisplayName}) => {
  if (!projectId || !userDisplayName) {
    console.log("Missing required data");
    return;
  }

  addDoc(collection(db, 'projects', projectId, "project-history"), {
    username: userDisplayName,
    action: action,
    actionId: actionId,
    actionType: actionType,
    createdAt: new Date(),
  })

  console.log('History Logged')
};