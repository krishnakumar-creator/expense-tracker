/**
 * DAILY COMMUTE & EXPENSE TRACKER - AUTHENTICATION MODULE (auth.js)
 * Supports Firebase Cloud Authentication & seamless local offline fallback.
 */

(function (window) {
  'use strict';

  const AUTH_USERS_KEY = 'dailyspends_users_v2';
  const AUTH_SESSION_KEY = 'dailyspends_session_v2';
  const AUTH_REDIRECT_KEY = 'dailyspends_post_login_redirect';

  // Seed default demo accounts for local fallback
  const DEFAULT_USERS = [];

  // Map commute preferences to icons
  const COMMUTE_ICONS = {
    rapido: '🛵',
    auto: '🛺',
    bus: '🚌',
    train: '🚆',
    fuel: '⛽',
    other: '✨'
  };

  const Auth = {
    /**
     * Check if Firebase Cloud Auth is active
     */
    isCloudActive: function () {
      return Boolean(window.FirebaseApp && window.FirebaseApp.isConfigured && window.FirebaseApp.auth);
    },

    /**
     * Format Firebase Auth error codes into friendly messages
     */
    _formatFirebaseError: function (err) {
      if (!err) return 'An unexpected error occurred.';
      const code = err.code || '';
      switch (code) {
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/user-not-found':
          return 'No account found with this email. Please check or sign up.';
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Incorrect password or email. Please try again.';
        case 'auth/email-already-in-use':
          return 'An account with this email already exists. Please Sign In.';
        case 'auth/weak-password':
          return 'Password must be at least 6 characters long.';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please wait a few moments and try again.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection.';
        default:
          return err.message || 'Authentication error.';
      }
    },

    /**
     * Retrieve all local registered users
     */
    getUsers: function () {
      try {
        const stored = localStorage.getItem(AUTH_USERS_KEY);
        if (!stored) {
          localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(DEFAULT_USERS));
          return [...DEFAULT_USERS];
        }
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(DEFAULT_USERS));
          return [...DEFAULT_USERS];
        }
        return parsed;
      } catch (err) {
        return [...DEFAULT_USERS];
      }
    },

    _saveUsers: function (users) {
      try {
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
      } catch (err) {
        console.error('Failed to save users:', err);
      }
    },

    findUserByEmail: function (email) {
      if (!email) return null;
      const normalized = email.trim().toLowerCase();
      const users = this.getUsers();
      return users.find(u => u.email.toLowerCase() === normalized) || null;
    },

    /**
     * Register a new user account (Firebase Cloud or Local)
     */
    register: async function ({ name, email, password, commutePref = 'rapido' }) {
      if (!name || !name.trim()) {
        return { success: false, error: 'Please enter your full name.' };
      }
      if (!email || !email.trim() || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Cloud Firebase Registration
      if (this.isCloudActive()) {
        try {
          const userCred = await window.FirebaseApp.auth.createUserWithEmailAndPassword(normalizedEmail, password);
          const fbUser = userCred.user;

          try {
            await fbUser.updateProfile({ displayName: name.trim() });
          } catch (e) {}

          // Create user document in Cloud Firestore
          if (window.FirebaseApp.db) {
            try {
              await window.FirebaseApp.db.collection('users').doc(fbUser.uid).set({
                name: name.trim(),
                email: normalizedEmail,
                commutePref: commutePref,
                createdAt: Date.now()
              }, { merge: true });
            } catch (dbErr) {
              console.warn('Could not write user profile to Firestore:', dbErr);
            }
          }

          const session = {
            id: fbUser.uid,
            name: name.trim(),
            email: normalizedEmail,
            commutePref: commutePref,
            avatar: COMMUTE_ICONS[commutePref] || '🛵',
            tagline: `${(commutePref.charAt(0).toUpperCase() + commutePref.slice(1))} Commuter`,
            loginTime: Date.now(),
            isCloud: true,
            rememberMe: true
          };

          this._setSession(session, true);
          return { success: true, user: session };
        } catch (err) {
          console.error('Firebase registration error:', err);
          return { success: false, error: this._formatFirebaseError(err) };
        }
      }

      // Local Fallback Registration
      const users = this.getUsers();
      const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return { success: false, error: 'An account with this email already exists. Please Sign In.' };
      }

      const newUser = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        commutePref: commutePref,
        avatar: COMMUTE_ICONS[commutePref] || '🛵',
        tagline: `${(commutePref.charAt(0).toUpperCase() + commutePref.slice(1))} Commuter`,
        createdAt: Date.now()
      };

      users.push(newUser);
      this._saveUsers(users);

      return { success: true, user: newUser };
    },

    /**
     * Authenticate and start session (Firebase Cloud or Local)
     */
    login: async function (email, password, rememberMe = true) {
      if (!email || !email.trim()) {
        return { success: false, error: 'Please enter your email.' };
      }
      if (!password) {
        return { success: false, error: 'Please enter your password.' };
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Cloud Firebase Login
      if (this.isCloudActive()) {
        try {
          const userCred = await window.FirebaseApp.auth.signInWithEmailAndPassword(normalizedEmail, password);
          const fbUser = userCred.user;

          let profile = {
            name: fbUser.displayName || normalizedEmail.split('@')[0],
            commutePref: 'rapido'
          };

          // Fetch profile from Firestore
          if (window.FirebaseApp.db) {
            try {
              const doc = await window.FirebaseApp.db.collection('users').doc(fbUser.uid).get();
              if (doc.exists) {
                profile = { ...profile, ...doc.data() };
              }
            } catch (e) {}
          }

          const session = {
            id: fbUser.uid,
            name: profile.name || fbUser.displayName || 'Commuter',
            email: fbUser.email,
            commutePref: profile.commutePref || 'rapido',
            avatar: COMMUTE_ICONS[profile.commutePref] || '🛵',
            tagline: `${((profile.commutePref || 'rapido').charAt(0).toUpperCase() + (profile.commutePref || 'rapido').slice(1))} Commuter`,
            loginTime: Date.now(),
            isCloud: true,
            rememberMe: Boolean(rememberMe)
          };

          this._setSession(session, rememberMe);
          return { success: true, user: session };
        } catch (err) {
          console.error('Firebase login error:', err);
          return { success: false, error: this._formatFirebaseError(err) };
        }
      }

      // Local Fallback Login
      const user = this.findUserByEmail(normalizedEmail);
      if (!user) {
        return { success: false, error: 'No account found with this email. Please check or Sign Up.' };
      }

      if (user.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        commutePref: user.commutePref || 'rapido',
        avatar: user.avatar || COMMUTE_ICONS[user.commutePref] || '🛵',
        tagline: user.tagline || 'Daily Commuter',
        loginTime: Date.now(),
        isCloud: false,
        rememberMe: Boolean(rememberMe)
      };

      this._setSession(session, rememberMe);
      return { success: true, user: session };
    },

    /**
     * Set active session
     */
    _setSession: function (session, rememberMe) {
      const serialized = JSON.stringify(session);
      try {
        if (rememberMe) {
          localStorage.setItem(AUTH_SESSION_KEY, serialized);
          sessionStorage.removeItem(AUTH_SESSION_KEY);
        } else {
          sessionStorage.setItem(AUTH_SESSION_KEY, serialized);
          localStorage.removeItem(AUTH_SESSION_KEY);
        }
      } catch (err) {
        console.error('Failed to set session:', err);
      }
    },

    getCurrentUser: function () {
      try {
        const local = localStorage.getItem(AUTH_SESSION_KEY);
        if (local) return JSON.parse(local);

        const session = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (session) return JSON.parse(session);
      } catch (err) {
        console.error('Failed to parse active session:', err);
      }
      return null;
    },

    isAuthenticated: function () {
      return this.getCurrentUser() !== null;
    },

    /**
     * Sign out current user
     */
    logout: async function (redirectUrl = 'login.html') {
      if (this.isCloudActive()) {
        try {
          await window.FirebaseApp.auth.signOut();
        } catch (e) {}
      }
      try {
        localStorage.removeItem(AUTH_SESSION_KEY);
        sessionStorage.removeItem(AUTH_SESSION_KEY);
      } catch (err) {
        console.error('Logout error:', err);
      }
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },

    requireAuth: function (redirectUrl = 'login.html') {
      if (!this.isAuthenticated()) {
        try {
          const currentPath = window.location.pathname.split('/').pop() || 'index.html';
          const fullRedirect = currentPath + window.location.search;
          sessionStorage.setItem(AUTH_REDIRECT_KEY, fullRedirect);
        } catch (e) {}
        window.location.replace(redirectUrl);
        return false;
      }
      return true;
    },

    redirectIfAuthenticated: function (defaultRedirect = 'index.html') {
      if (this.isAuthenticated()) {
        let target = defaultRedirect;
        try {
          const stored = sessionStorage.getItem(AUTH_REDIRECT_KEY);
          if (stored && !stored.includes('login.html')) {
            target = stored;
            sessionStorage.removeItem(AUTH_REDIRECT_KEY);
          }
        } catch (e) {}
        window.location.replace(target);
        return true;
      }
      return false;
    },

    /**
     * Reset password
     */
    resetPassword: async function (email, newPassword = null) {
      if (!email || !email.trim()) return { success: false, error: 'Email is required.' };
      const normalized = email.trim().toLowerCase();

      // Cloud Firebase Password Reset
      if (this.isCloudActive()) {
        try {
          await window.FirebaseApp.auth.sendPasswordResetEmail(normalized);
          return { 
            success: true, 
            message: 'Password reset link sent to ' + normalized + '! Please check your inbox.' 
          };
        } catch (err) {
          return { success: false, error: this._formatFirebaseError(err) };
        }
      }

      // Local fallback reset
      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters.' };
      }

      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === normalized);

      if (userIndex === -1) {
        return { success: false, error: 'No account found with this email.' };
      }

      users[userIndex].password = newPassword;
      this._saveUsers(users);
      return { success: true, message: 'Password updated successfully!' };
    },

    getInitials: function (name) {
      if (!name) return 'DS';
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
  };

  // Expose to window
  window.Auth = Auth;
})(window);
