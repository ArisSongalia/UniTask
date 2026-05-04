/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyANEbqOmBO1iYDFXkYMUCC2vl3TaYRMgjs",
  authDomain: "unitask-b9b5e.firebaseapp.com",
  projectId: "unitask-b9b5e",
  storageBucket: "unitask-b9b5e.firebasestorage.app",
  messagingSenderId: "103699486640",
  appId: "1:103699486640:web:9352f9ea290b260e8f2875",
  measurementId: "G-8FG7KVP785",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "UniTask";
  const notificationOptions = {
    body: payload?.notification?.body || "You have a new notification.",
    data: payload?.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
