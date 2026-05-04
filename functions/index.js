const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.onNotificationCreate = functions.firestore
  .document("users/{uid}/notifications/{notifId}")
  .onCreate(async (snap, context) => {
    const uid = context.params.uid;
    const data = snap.data() || {};

    const userSnap = await admin.firestore().collection("users").doc(uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};
    if (userData.pushEnabled === false) return null;

    const tokens = userData.fcmTokens || [];

    if (!tokens.length) return null;

    const title = data.title || "UniTask";
    const body = data.message || "You have a new notification.";

    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: {
        type: data.type || "notification",
        projectId: data.projectId ? String(data.projectId) : "",
        taskId: data.taskId ? String(data.taskId) : "",
      },
    });

    return null;
  });
