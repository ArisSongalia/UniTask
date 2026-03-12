import { addDoc, setDoc, collection, increment, doc, arrayUnion, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../config/firebase";

export const logAnalytics = async ({ projectId, event, taskData }) => {
  if (!projectId || !taskData) return console.log('Log Analytics: Missing Data');

  const user = auth.currentUser;
  if (!user) return;

  const metricsId = `${projectId}_metrics`;

  // Completion time in minutes
  let completionTime = null;
  if (taskData.completedAt && taskData.createdAt) {
    const createdAt  = taskData.createdAt.toDate  ? taskData.createdAt.toDate()  : taskData.createdAt;
    const completedAt = taskData.completedAt.toDate ? taskData.completedAt.toDate() : taskData.completedAt;
    completionTime = Math.round((completedAt.getTime() - createdAt.getTime()) / 60000);
  }

  try {
    await addDoc(collection(db, 'projects', projectId, 'events'), {
      timestamp:          serverTimestamp(),
      projectId:          projectId,
      team:               taskData.team,
      event:              event,
      taskId:             taskData.id,
      status:             taskData.status,
      priority:           taskData.priority,
      completionDuration: completionTime,
    });

    const updateData = {
      projectActivity: increment(1),
    };

    // Track who's doing work
    if (taskData.team?.length) {
      updateData.userActivity = arrayUnion(...taskData.team.map(m => m.username));
    }

    // Priority distribution — only when a task is first created
    if (event === 'task_created') {
      if (taskData.priority === 'High')   updateData.highPriorityTasks   = increment(1);
      if (taskData.priority === 'Medium') updateData.mediumPriorityTasks = increment(1);
      if (taskData.priority === 'Low')    updateData.lowPriorityTasks    = increment(1);
    }

    // Stage tracking — only on status change events
    if (event === 'task_updated') {
      if (taskData.status === 'In-progress') updateData.tasksStarted  = increment(1);
      if (taskData.status === 'To-review')   updateData.tasksInReview = increment(1);
    }

    // Overdue vs due soon — mutually exclusive, only for unfinished tasks
    if (taskData.deadline && taskData.status !== 'Finished') {
      const now      = new Date();
      const deadline = taskData.deadline.toDate?.() ?? taskData.deadline;
      const msRemaining = deadline - now;
      const oneDayMs    = 24 * 60 * 60 * 1000;

      if (msRemaining < 0) {
        updateData.overdueTasks = increment(1);
      } else if (msRemaining <= oneDayMs) {
        updateData.dueSoonTasks = increment(1);
      }
    }

    // On-time vs late — only when task is completed
    if (event === 'task_completed' && taskData.deadline && completionTime !== null) {
      const deadline    = taskData.deadline.toDate?.()    ?? taskData.deadline;
      const completedAt = taskData.completedAt.toDate?.() ?? taskData.completedAt;

      if (completedAt <= deadline) updateData.tasksOnTime = increment(1);
      else                         updateData.tasksLate   = increment(1);
    }

    await setDoc(
      doc(db, "projects", projectId, "metrics", metricsId),
      updateData,
      { merge: true }
    );

  } catch (err) {
    console.error('logAnalytics failed:', err);
  }
};