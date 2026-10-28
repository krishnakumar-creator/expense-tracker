# 🗄️ Connecting Firebase Cloud Database to your GitHub-Hosted Site

Since your site is already hosted on GitHub (e.g. GitHub Pages or repo), you **do not need any new hosting or deployment commands**. Firebase will simply act as your remote **Cloud Database (Cloud Firestore)** and authentication service.

All you need is to paste your Firebase project keys into `firebase-config.js`, publish your security rules, and push your code to GitHub!

---

## ⚡ Setup Guide & Security Checklist

### Step 1: Create a Free Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **"Add project"**.
2. Give it a name (e.g., `dailyspends`) and click **"Create Project"**.

---

### Step 2: Enable Cloud Firestore (The Database)
1. In the Firebase sidebar, go to **Build > Firestore Database**.
2. Click **"Create database"**.
3. Choose a server location near you (e.g., `asia-south1` or `us-central`).
4. Select **"Start in test mode"** and click **"Create"**.

---

### Step 3: 🔒 Publish Firestore Security Rules (CRITICAL FOR SECURITY)
> ⚠️ **IMPORTANT**: Leaving Firestore in "Test Mode" leaves your database open to anyone. You must lock down access to authenticated users:

1. In Firebase Console, go to **Build > Firestore Database**.
2. Click the **"Rules"** tab at the top.
3. Replace the entire contents with the rules from [`firestore.rules`](./firestore.rules):

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidExpense(data) {
      return data.amount is number
        && data.amount >= 0
        && data.amount < 100000000
        && data.category is string
        && data.category.size() <= 50
        && data.date is string
        && data.date.size() <= 20
        && (!('note' in data) || (data.note is string && data.note.size() <= 500))
        && (!('paymentMode' in data) || (data.paymentMode is string && data.paymentMode.size() <= 50))
        && (!('time' in data) || (data.time is string && data.time.size() <= 20))
        && (!('createdAt' in data) || data.createdAt is number)
        && (!('updatedAt' in data) || data.updatedAt is number);
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /expenses/{expenseId} {
        allow read, delete: if isOwner(userId);
        allow create, update: if isOwner(userId) && isValidExpense(request.resource.data);
      }

      match /{allPaths=**} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

4. Click the blue **"Publish"** button. Your database is now strictly isolated per user!

---

### Step 4: Enable Authentication (For User Accounts)
1. In the sidebar, go to **Build > Authentication** and click **"Get Started"**.
2. In the **"Sign-in method"** tab, click **Email/Password**, toggle **Enable**, and click **Save**.
3. In the **"Settings"** tab > **"Authorized domains"**, make sure your domains are listed:
   - `localhost` is included by default.
   - Click **"Add domain"** and add your GitHub Pages domain (e.g., `yourusername.github.io`).

---

### Step 5: Paste Your Keys into `firebase-config.js`
1. In Firebase Console, click the ⚙️ **Gear icon** (top left) > **Project settings**.
2. Scroll down to **"Your apps"** and click the Web icon (**`</>`**).
3. Register the app with any nickname (e.g. `DailySpends`).
4. Copy the values from the `firebaseConfig` snippet into [`firebase-config.js`](./firebase-config.js):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

---

### Step 6: Restrict API Key (Recommended Best Practice)
1. Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Select your Firebase project.
3. Click your **Browser API key**.
4. Under **"Application restrictions"**, choose **Websites / HTTP referrers**.
5. Add your website domains (e.g., `http://localhost:*`, `https://yourusername.github.io/*`).
6. Click **Save**. This prevents unauthorized third-party websites from consuming your Firebase quota.

---

### Step 7: Push to GitHub
Commit and push your updated files to GitHub:

```powershell
git add .
git commit -m "Secure Firebase Cloud Firestore and authentication"
git push
```

Your GitHub-hosted site is now safely connected to Cloud Firestore with isolated, authenticated user storage!
