/**
 * DAILY COMMUTE & EXPENSE TRACKER - CLOUD FIRESTORE DATABASE SERVICE (db.js)
 * Manages Cloud Database storage, real-time sync, and offline persistence.
 */

(function (window) {
  'use strict';

  const DB = {
    /**
     * Check if Cloud Firestore is active
     */
    isCloudActive: function () {
      return Boolean(window.FirebaseApp && window.FirebaseApp.isConfigured && window.FirebaseApp.db);
    },

    /**
     * Get Firestore instance
     */
    getFirestore: function () {
      return this.isCloudActive() ? window.FirebaseApp.db : null;
    },

    /**
     * Load all expenses for a user from Cloud Firestore
     */
    loadExpenses: async function (userId) {
      if (!userId) return [];

      if (this.isCloudActive()) {
        try {
          const db = this.getFirestore();
          const snapshot = await db
            .collection('users')
            .doc(userId)
            .collection('expenses')
            .orderBy('createdAt', 'desc')
            .get();

          const expenses = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            expenses.push({
              id: doc.id,
              ...data
            });
          });

          // Backup into localStorage for offline instant loading
          try {
            localStorage.setItem(`dailyspends_data_${userId}`, JSON.stringify(expenses));
          } catch (e) {}

          return expenses;
        } catch (err) {
          console.error('Error fetching expenses from Firestore:', err);
          // Fall back to local storage cache
          return this.getLocalExpenses(userId);
        }
      }

      // Offline / Local Mode
      return this.getLocalExpenses(userId);
    },

    /**
     * Real-time listener for user expenses
     */
    subscribeExpenses: function (userId, onUpdate) {
      if (!userId || !this.isCloudActive()) return null;

      try {
        const db = this.getFirestore();
        return db
          .collection('users')
          .doc(userId)
          .collection('expenses')
          .orderBy('createdAt', 'desc')
          .onSnapshot((snapshot) => {
            const expenses = [];
            snapshot.forEach(doc => {
              expenses.push({ id: doc.id, ...doc.data() });
            });
            try {
              localStorage.setItem(`dailyspends_data_${userId}`, JSON.stringify(expenses));
            } catch (e) {}
            if (typeof onUpdate === 'function') {
              onUpdate(expenses);
            }
          }, (err) => {
            console.error('Firestore real-time subscription error:', err);
          });
      } catch (err) {
        console.error('Failed to setup Firestore listener:', err);
        return null;
      }
    },

    /**
     * Save / Add a new expense record
     */
    saveExpense: async function (userId, expense) {
      if (!userId || !expense) return false;

      // Update local storage cache immediately
      this.saveLocalExpense(userId, expense);

      if (this.isCloudActive()) {
        try {
          const db = this.getFirestore();
          const docRef = db
            .collection('users')
            .doc(userId)
            .collection('expenses')
            .doc(expense.id);

          await docRef.set({
            amount: Number(expense.amount),
            category: expense.category,
            note: expense.note || '',
            date: expense.date,
            time: expense.time || '',
            paymentMode: expense.paymentMode || 'UPI',
            createdAt: expense.createdAt || Date.now(),
            updatedAt: Date.now()
          }, { merge: true });

          return true;
        } catch (err) {
          console.error('Failed to save expense to Firestore:', err);
          return false;
        }
      }

      return true;
    },

    /**
     * Delete an expense
     */
    deleteExpense: async function (userId, expenseId) {
      if (!userId || !expenseId) return false;

      // Update local cache
      this.deleteLocalExpense(userId, expenseId);

      if (this.isCloudActive()) {
        try {
          const db = this.getFirestore();
          await db
            .collection('users')
            .doc(userId)
            .collection('expenses')
            .doc(expenseId)
            .delete();
          return true;
        } catch (err) {
          console.error('Failed to delete expense in Firestore:', err);
          return false;
        }
      }

      return true;
    },

    /**
     * Save user settings to Firestore (budget, currency, theme)
     */
    saveSettings: async function (userId, settings) {
      if (!userId || !settings) return false;

      try {
        localStorage.setItem(`dailyspends_settings_${userId}`, JSON.stringify(settings));
      } catch (e) {}

      if (this.isCloudActive()) {
        try {
          const db = this.getFirestore();
          await db.collection('users').doc(userId).set({
            settings: settings,
            updatedAt: Date.now()
          }, { merge: true });
          return true;
        } catch (err) {
          console.error('Failed to save user settings in Firestore:', err);
        }
      }
      return true;
    },

    /**
     * Load user settings
     */
    loadSettings: async function (userId) {
      if (!userId) return null;

      if (this.isCloudActive()) {
        try {
          const db = this.getFirestore();
          const doc = await db.collection('users').doc(userId).get();
          if (doc.exists && doc.data().settings) {
            const settings = doc.data().settings;
            try {
              localStorage.setItem(`dailyspends_settings_${userId}`, JSON.stringify(settings));
            } catch (e) {}
            return settings;
          }
        } catch (err) {
          console.error('Failed to load settings from Firestore:', err);
        }
      }

      try {
        const local = localStorage.getItem(`dailyspends_settings_${userId}`);
        return local ? JSON.parse(local) : null;
      } catch (e) {
        return null;
      }
    },

    /**
     * Batch save multiple expenses (useful for import or initial migration)
     */
    batchSaveExpenses: async function (userId, expenses) {
      if (!userId || !Array.isArray(expenses)) return false;

      try {
        localStorage.setItem(`dailyspends_data_${userId}`, JSON.stringify(expenses));
      } catch (e) {}

      if (this.isCloudActive()) {
        try {
          const db = this.getFirestore();
          const batch = db.batch();
          const userExpensesRef = db.collection('users').doc(userId).collection('expenses');

          expenses.forEach(exp => {
            const ref = userExpensesRef.doc(exp.id);
            batch.set(ref, exp, { merge: true });
          });

          await batch.commit();
          return true;
        } catch (err) {
          console.error('Failed batch save to Firestore:', err);
          return false;
        }
      }
      return true;
    },

    // -------------------------------------------------------------
    // LOCAL STORAGE FALLBACK HELPERS
    // -------------------------------------------------------------
    getLocalExpenses: function (userId) {
      try {
        const raw = localStorage.getItem(`dailyspends_data_${userId}`);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    saveLocalExpense: function (userId, expense) {
      try {
        const list = this.getLocalExpenses(userId);
        const idx = list.findIndex(e => e.id === expense.id);
        if (idx >= 0) {
          list[idx] = expense;
        } else {
          list.unshift(expense);
        }
        localStorage.setItem(`dailyspends_data_${userId}`, JSON.stringify(list));
      } catch (e) {}
    },

    deleteLocalExpense: function (userId, expenseId) {
      try {
        let list = this.getLocalExpenses(userId);
        list = list.filter(e => e.id !== expenseId);
        localStorage.setItem(`dailyspends_data_${userId}`, JSON.stringify(list));
      } catch (e) {}
    }
  };

  window.AppDB = DB;
})(window);

