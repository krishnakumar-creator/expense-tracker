# 🗄️ Connecting Firebase Cloud Database to your GitHub-Hosted Site

Since your site is already hosted on GitHub (e.g. GitHub Pages or repo), you **do not need any new hosting or deployment commands**. Firebase will simply act as your remote **Cloud Database (Cloud Firestore)** and authentication service.

All you need is to paste your Firebase project keys into `firebase-config.js` and push your code to GitHub!

---

## ⚡ 3-Minute Setup

### Step 1: Create a Free Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **"Add project"**.
2. Give it a name (e.g., `dailyspends`) and click **"Create Project"**.

---

### Step 2: Enable Cloud Firestore (The Database)
1. In the Firebase sidebar, go to **Build > Firestore Database**.
2. Click **"Create database"**.
3. Choose a server location near you (e.g., `asia-south1` or `us-central`).
4. Select **"Start in test mode"** (allows reads/writes while developing) and click **"Create"**.

---

### Step 3: Enable Authentication (For User Accounts)
1. In the sidebar, go to **Build > Authentication** and click **"Get Started"**.
2. In the **"Sign-in method"** tab, click **Email/Password**, toggle **Enable**, and click **Save**.
3. In the **"Settings"** tab > **"Authorized domains"**, make sure your GitHub domain is listed:
   - `localhost` is included by default.
   - Click **"Add domain"** and add your GitHub Pages domain (e.g., `yourusername.github.io`).

---

### Step 4: Paste Your Keys into `firebase-config.js`
1. In Firebase Console, click the ⚙️ **Gear icon** (top left) > **Project settings**.
2. Scroll down to **"Your apps"** and click the Web icon (**`</>`**).
3. Register the app with any nickname (e.g. `DailySpends`).
4. Copy the values from the `firebaseConfig` snippet into [`firebase-config.js`](./firebase-config.js):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

---

### Step 5: Push to GitHub
Commit and push your updated `firebase-config.js` to GitHub:

```powershell
git add .
git commit -m "Connect Firebase Cloud Firestore database"
git push
```

Your GitHub-hosted site is now directly connected to Cloud Firestore! All logged expenses, user accounts, and budgets will automatically save to the cloud database and sync in real-time.
