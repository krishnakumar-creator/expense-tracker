# Daily Commute & Routine Expense Tracker 📱🛵🛺

A mobile-first, ultra-responsive web application designed for tracking daily travel expenses (**Auto, Bus, Train, Rapido**) and routine daily spends (**Tea & Snacks, Lunch, Food**).

---

## ✨ Features

- **☁️ Cloud Database (Firebase Cloud Firestore)**:
  - **Cloud Firestore**: Real-time cloud database syncing expenses and user settings across devices.
  - **Firebase Authentication**: Cloud-managed user registration, secure login, and password resets.
  - **Offline-First Resilience**: Automatic local caching so expenses can be logged in offline zones (e.g. metro tunnels) and auto-sync when back online.
  - **Zero Backend Server Needed**: Runs directly from GitHub, communicating securely with Cloud Firestore.
- **🔐 Clean Authentication & User Profiles**:
  - Dedicated **Login & Registration** (`login.html`) with focused email & password authentication.
  - **Multi-user isolation**: Each user gets their own dedicated cloud database space.
  - Show/hide password toggle, live password strength meter, and password recovery.
  - Profile badge & dropdown menu in header with live **Cloud Synced** status and **Sign Out**.
- **⚡ 1-Tap Quick Commute Presets**:
  - 🛵 **Rapido**: Log bike taxi fares in 2 seconds.
  - 🛺 **Auto**: Track auto rickshaw meters / fixed fares.
  - 🚌 **Bus**: Commute tickets and daily passes.
  - 🚆 **Train / Metro**: Metro card recharges and local train tickets.
  - ☕ **Tea & Snacks**: Daily chai breaks, puff, and evening snacks.
  - 🍱 **Lunch & Food**: Daily lunch thalis, meals, mess fees.
- **📅 Monthly Tracking & Navigation**:
  - Month-by-month picker with previous/next navigation.
  - Dedicated Monthly Summary Card showing **Total Spent** vs. **Monthly Budget**.
  - Commute Focus Card showing trips count and auto/bus/train/rapido mini pills.
  - Food & Snacks Focus Card.
- **📊 Monthly Analytics & Visual Reports**:
  - Visual Commute Breakdown progress bars (% share and trip counts).
  - Dynamic Category Donut Chart.
  - Day-by-Day spending bar chart across the entire month.
  - Commute stats (Total rides taken, average fare per ride, chai count, lunch count).
- **📱 Mobile Ergonomics & PWA**:
  - Native bottom-sheet logging modal on mobile screens.
  - Quick amount tap chips (`+10`, `+20`, `+50`, `+100`, `+150`, `+200`).
  - Dark & Light mode toggle.
  - Installable to home screen on Android and iOS (PWA manifest & icons included).
- **💾 Offline & Data Management**:
  - Automatically saves all data locally in the browser (`localStorage`).
  - **Export CSV** (opens cleanly in Excel / Google Sheets).
  - **Backup & Restore JSON** to transfer or backup data between devices.
  - Preloaded with realistic commute data to test immediately.

---

## 🚀 How to Run & Connect

### Method 1: GitHub Hosting with Firebase Cloud Database
Since you host your code on GitHub (e.g. GitHub Pages), you do not need any new hosting or servers:
1. Follow the quick guide in [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) to enable Cloud Firestore and paste your keys into [`firebase-config.js`](./firebase-config.js).
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Connect Firebase Cloud Firestore database"
   git push
   ```
Your GitHub-hosted site is now live with real-time Cloud Firestore database persistence!

### Method 2: Local Server (For testing before pushing)
From terminal:
```powershell
cd "c:\Users\Lenovo\.gemini\antigravity\scratch\expense-tracker"
node server.js
```
Then open:
- On your PC: `http://localhost:3000`
- On your Mobile Phone (connected to the same Wi-Fi): `http://<YOUR_LAN_IP>:3000`

### Method 3: Direct File Open (Zero Installation)
Simply double click `index.html` in file explorer. It runs directly in any modern web browser without needing any server or build step!

---

## 📱 How to Add to Mobile Home Screen (App Mode)

1. Open the URL in Chrome on Android or Safari on iPhone.
2. **On Android (Chrome)**: Tap the 3 dots menu `⋮` > Select **"Add to Home Screen"** or **"Install App"**.
3. **On iOS (Safari)**: Tap the Share button 📤 > Select **"Add to Home Screen"**.
4. The tracker will now launch in full-screen app mode with its own icon!
