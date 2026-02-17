import { addDoc, setDoc, getDoc, collection, increment, doc, arrayUnion, serverTimestamp} from "firebase/firestore"
import { auth, db } from "../config/firebase";

export const logAnalytics = async ({ projectId, event, taskData}) => {
  if(!projectId || !taskData) return console.log('Log Analytics: Missing Data');
  const user = auth.currentUser;
  if(!user) return
  const metricsId = `${projectId}_metrics`;

  await addDoc(collection(db, 'projects', projectId, 'events'), {
    timestamp: serverTimestamp(),
    projectId: projectId,
    user: user.displayName,
    event: event,
    taskId: taskData.id,
    status: taskData.status,
    priority: taskData.priority,
  }) 

  let completionTime = null;

  if (taskData.completedAt && taskData.createdAt) {
    completionTime =
      taskData.completedAt.toDate() - taskData.createdAt.toDate();
  }

  const updateData = {
    projectActivity: increment(1),
    userActivity: arrayUnion(user.displayName),
  };

  if (completionTime) {
    updateData.totalCompletionTime = increment(completionTime);
    updateData.tasksCompleted = increment(1);
  }

  await setDoc(
    doc(db, "projects", projectId, "metrics", metricsId),
    updateData,
    { merge: true }
  );
};

