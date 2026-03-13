# 🌾 FarmPal - Smart Farm Management for Egg Producers

**FarmPal** is a mobile-based farm management application designed specifically for **poultry egg producers**. The system helps farmers manage daily farm operations such as **egg production tracking, feed consumption monitoring, and expense management** using a simple and user-friendly mobile interface.

By replacing traditional notebook-based record keeping with a digital platform, FarmPal allows farmers to **record data, analyze farm performance, and make better decisions through real-time insights and automated reports**. 

---

# 🌟 Features

## 🐔 For Poultry Farmers

* **Egg Production Tracking** – Record daily egg production and monitor trends
* **Feed Consumption Management** – Track feed usage and feeding schedules
* **Expense Management** – Log farm expenses and analyze cost patterns
* **Performance Analytics** – View reports and insights through dashboards
* **Offline Data Entry** – Record farm data without internet access
* **Cloud Backup** – Secure data storage and synchronization using Firebase
* **Simple Mobile Interface** – Designed for easy use by small and medium-scale farmers

---

# 📊 Core System Capabilities

### 📈 Farm Analytics

* Track production trends
* Monitor feed efficiency
* Analyze operational costs
* Generate farm performance reports

### 📱 Mobile-first Design

* Built specifically for smartphone usage
* Simplified data entry forms
* User-friendly interface for farmers

### ☁️ Cloud Data Management

* Secure cloud backup
* Real-time data synchronization
* Offline storage with later sync

---

# 🏗️ Architecture

## Project Structure

```
farm-pal/
│
├── src/
│   │
│   ├── screens/
│   │   ├── DashboardScreen.js
│   │   ├── EggProductionScreen.js
│   │   ├── FeedTrackingScreen.js
│   │   ├── ExpenseManagementScreen.js
│   │   ├── ReportsScreen.js
│   │   └── ProfileScreen.js
│   │
│   ├── components/
│   │   ├── EggCard.js
│   │   ├── FeedCard.js
│   │   ├── ExpenseCard.js
│   │   └── ChartComponent.js
│   │
│   ├── services/
│   │   ├── firebaseService.js
│   │   ├── authService.js
│   │   └── dataService.js
│   │
│   ├── database/
│   │   └── localStorage.js
│   │
│   ├── navigation/
│   │   └── AppNavigator.js
│   │
│   └── App.js
│
├── assets/
│
├── package.json
│
└── README.md
```

---
# ⚙️ Technology Stack

### Mobile Application

* **Framework:** React Native
* **Language:** JavaScript

### Backend 
* **Database:** Firebase SQLite
* **Authentication:** Firebase Authentication

### Local Storage

* **SQLite / AsyncStorage** for offline data storage

### Development Tools

* **IDE:** Visual Studio Code
* **Version Control:** GitHub
* **UI Design:** Figma
* **Project Management:** Asana Board
* **Package Manager:** npm

These technologies allow FarmPal to deliver a **scalable, mobile-first solution with both offline capability and cloud synchronization.** 

---

# 📱 System Architecture

FarmPal uses a **mobile-first architecture** that combines:

```
User (Farmer)
      │
      ▼
React Native Mobile Application
      │
      ▼
Firebase Services
 ├── Firestore Database
 ├── Authentication
      │
      ▼
Local Storage (SQLite / AsyncStorage)
```

This architecture ensures:

* **Offline functionality**
* **Secure cloud backup**
* **Real-time data management**

---
# 🎯 System Objectives

The main objectives of FarmPal include:

* **Centralize** – Provide a single platform to manage feed tracking, egg production, and expenses.
* **Empower Farmers** – Enable farmers to make better decisions using automated reports and analytics. 

---

# 🚀 Installation & Setup

## Prerequisites

* Node.js (v16 or later)
* npm
* React Native CLI
* Android Studio / Emulator

---

## Step 1 – Clone Repository

```bash
git clone https://github.com/your-repo/farmpal.git
cd farmpal
```

---

## Step 2 – Install Dependencies

```bash
npm install
```

---

## Step 3 – Configure Firebase

1. Create a Firebase project
2. Enable:

   * Authentication
   * Firestore Database
3. Add Firebase configuration to your project.

Example:

```javascript
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "project.firebaseapp.com",
  projectId: "project_id",
  storageBucket: "project.appspot.com",
  messagingSenderId: "sender_id",
  appId: "app_id"
};
```

---

## Step 4 – Run Application

```bash
npx expo start
```


---

# 🧪 Testing

FarmPal testing includes:

### Functional Testing

* Egg production recording
* Feed usage tracking
* Expense logging
* Report generation

### Test Case Document

Project test cases and results:

[https://docs.google.com/spreadsheets/d/1S_iI2xbP3yFPVPytPlIOAQ9zm1Yipz6-uVtAJVUUS0A/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1S_iI2xbP3yFPVPytPlIOAQ9zm1Yipz6-uVtAJVUUS0A/edit?usp=sharing) 

---

# ⚠️ Project Limitations

* Requires access to a **smartphone or smart device**
* **Poor internet connectivity** may affect cloud synchronization
* Farmers may require **basic digital literacy**
* Some traditional farmers may **resist adopting digital systems** initially 

---

# 📈 Future Improvements

Possible future enhancements include:

* AI-based production predictions
* IoT sensors for real-time farm monitoring
* Advanced analytics dashboards
* Multi-language support
* Integration with smart poultry equipment

---

# 📌 Conclusion

FarmPal provides a **simple yet powerful digital platform for poultry farm management**, enabling farmers to track production, manage expenses, and analyze farm performance more efficiently.

By combining **mobile accessibility, automated reporting, offline storage, and cloud backup**, the system addresses key limitations of traditional farm record keeping and helps farmers make **data-driven decisions to improve productivity and profitability.** 

---

# 🔗 Project Links

### 🎥 Project Demo

[https://tinyurl.com/3a26b944](https://tinyurl.com/3a26b944) 
