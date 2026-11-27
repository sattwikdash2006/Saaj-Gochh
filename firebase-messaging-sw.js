/* Saaj Gochh — Firebase Cloud Messaging service worker.
   Keep this file at the published GitHub Pages site root, beside index.html. */

importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA874tDgviiYycwKYZhPPvXtLEdKxo2og0",
  authDomain: "saaj-gochh.firebaseapp.com",
  projectId: "saaj-gochh",
  storageBucket: "saaj-gochh.firebasestorage.app",
  messagingSenderId: "575111387265",
  appId: "1:575111387265:web:2450fbfd51a1024f19d580",
  measurementId: "G-KHSMMLRX9L"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Avoid duplicate notifications when the payload already contains notification data.
  if (payload && payload.notification) return;

  const data = (payload && payload.data) || {};

  const title = data.title || "Saaj Gochh";

  const options = {
    body: data.body || "There is a new update from Saaj Gochh.",
    data: {
      link: data.link || self.registration.scope
    }
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawLink =
    (event.notification.data && event.notification.data.link) ||
    self.registration.scope;

  const targetUrl = new URL(rawLink, self.registration.scope).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of windows) {
      if (client.url === targetUrl && "focus" in client) {
        return client.focus();
      }
    }

    if (self.clients.openWindow) {
      return self.clients.openWindow(targetUrl);
    }
  })());
});
