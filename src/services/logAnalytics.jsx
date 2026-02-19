import { addDoc, setDoc, getDoc, collection, increment, doc, arrayUnion, serverTimestamp} from "firebase/firestore"
import { auth, db } from "../config/firebase";

export const logAnalytics = async ({ projectId, event, taskData}) => {
  if(!projectId || !taskData) return console.log('Log Analytics: Missing Data');
  const user = auth.currentUser;

  if(!user) return
  const metricsId = `${projectId}_metrics`;

  let completionTime = null;

  if (taskData.completedAt && taskData.createdAt) {
    const createdAt = taskData.createdAt.toDate ? taskData.createdAt.toDate() : taskData.createdAt;
    const completedAt = taskData.completedAt.toDate ? taskData.completedAt.toDate() : taskData.completedAt;

    completionTime = completedAt.getTime() - createdAt.getTime(); 
  }

  await addDoc(collection(db, 'projects', projectId, 'events'), {
    timestamp: serverTimestamp(),
    projectId: projectId,
    team: taskData.team,
    event: event,
    taskId: taskData.id,
    status: taskData.status,
    priority: taskData.priority,
    completionDuration: completionTime,
  }) 


  //Metrics data
  const updateData = {
    projectActivity: increment(1),
  };

  if(taskData.status === 'Finished') {
    updateData.totalCompletionTime = increment(completionTime);
  }

  if (completionTime) {
    updateData.tasksCompleted = increment(1);
  };

  if (taskData.priority === 'Urgent') {
    updateData.urgentTasks = increment(1);
  };

  await setDoc(
    doc(db, "projects", projectId, "metrics", metricsId),
    updateData,
    { merge: true }
  );
};

