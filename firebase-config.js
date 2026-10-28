/**
 * DAILY COMMUTE & EXPENSE TRACKER - FIREBASE CONFIGURATION (firebase-config.js)
 * Initializes Firebase Authentication and Cloud Firestore Database.
 */

(function (window) {
  'use strict';

  // =========================================================================
  // REPLACE THE PLACEHOLDERS BELOW WITH YOUR FIREBASE PROJECT CONFIG KEYS
  // You can get these in 30 seconds from: https://console.firebase.google.com/
  // Project Settings > General > Your Apps > Web app (</>)
  // =========================================================================
  const firebaseConfig = {
    apiKey: "AIzaSyAPbxLEETgEMsZPDhm82SOry_0qNeTmAXM",
    authDomain: "expense-tracker-ad7c5.firebaseapp.com",
    projectId: "expense-tracker-ad7c5",
    storageBucket: "expense-tracker-ad7c5.firebasestorage.app",
    messagingSenderId: "507241583588",
    appId: "1:507241583588:web:39fedf8bc8bb393b91edf1"
  };

  // Project credentials are configured
  const isConfigured = Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId && 
    !firebaseConfig.apiKey.includes('YOUR_API_KEY')
  );

  let app = null;
  let auth = null;
  let db = null;

  if (isConfigured && typeof window.firebase !== 'undefined') {
    try {
      if (!window.firebase.apps.length) {
        app = window.firebase.initializeApp(firebaseConfig);
      } else {
        app = window.firebase.app();
      }
      auth = window.firebase.auth();
      db = window.firebase.firestore();

      // Enable offline persistence so data is available and cached offline
      db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence failed: multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence not supported by this browser');
        }
      });

      console.log('🔥 Firebase Cloud Auth & Firestore successfully initialized!');
    } catch (err) {
      console.error('Firebase initialization error:', err);
    }
  } else {
    console.info('ℹ️ Firebase is running in Local/Demo mode. Update firebase-config.js with your project credentials to connect to Cloud DB.');
  }

  window.FirebaseApp = {
    config: firebaseConfig,
    isConfigured: isConfigured,
    app: app,
    auth: auth,
    db: db
  };

})(window);

