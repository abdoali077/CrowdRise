# 🚀 CrowdRise — Client-Side Crowdfunding Platform

CrowdRise is a fully client-side crowdfunding platform that simulates real-world campaign management and funding workflows using modern JavaScript architecture (ES Modules) and browser-based persistence (localStorage).

This project demonstrates scalable frontend architecture, dynamic UI rendering, and state management without relying on a backend.

---

## ✨ Key Highlights

* 🧠 Modular architecture using ES Modules
* ⚡ Single entry point (`main.js`) for controlled app initialization
* 🔄 Dynamic UI fully driven by localStorage state
* 👤 Global user state (profile, image, stats) synced across all pages
* 🛠️ Admin & User role separation
* 📦 Clean and scalable folder structure
* 🚀 Ready for deployment (Vercel / static hosting)

---

## 📌 Core Features

### 👤 User System

* Authentication (Register / Login using localStorage)
* Profile management (image, name, location)
* Real-time UI updates across all pages

### 💡 Campaign Management

* Create / Edit / Delete campaigns
* Campaign status handling (Active / Closed based on deadline)
* Dynamic campaign rendering

### 💰 Funding System

* Support campaigns (pledges)
* Real-time funding progress calculation
* User contribution tracking

### 📊 Dashboard & Analytics

* User stats:

  * Created campaigns
  * Supported campaigns
  * Total pledged
* Admin insights:

  * Campaign performance
  * User activity
  * Pledge tracking

---

## 🧱 Project Structure

CrowdRise/
│
├── index.html                 # Entry point
│
├── pages/                     # All application pages
│   ├── Admin/
│   ├── User_Page/
│   └── (auth & public pages)
│
├── css/                       # Styles (modular per feature)
├── js/
│   ├── core/                  # Shared logic (auth, storage, UI)
│   ├── Admin/
│   ├── UserPages/
│   ├── Guest/
│   └── main.js                # App bootstrap & routing
│
├── images/                    # Assets
└── README.md
```

---

## ⚙️ Tech Stack

* **HTML5**
* **CSS3** (Responsive, modern UI)
* **JavaScript (ES Modules)**
* **LocalStorage** (Client-side persistence)

---

## 🧠 Architecture Overview

* Centralized initialization via `main.js`
* Shared utilities:

  * `storage.js` → data layer abstraction
  * `auth.js` → authentication logic
  * `user-ui.js` → global UI sync (profile, avatar)
* Route-based module loading
* Separation of concerns per feature

---

## 🔄 Data Model (LocalStorage)

* `users`
* `campaigns`
* `pledges`
* `currentUser`

All UI components react to this data layer dynamically.

---

## 🚀 Getting Started

git clone https://github.com/abdoali077/CrowdRise.git


Open:

index.html


---
## 🌐 Live Demo

Experience the application live:

🔗 https://crowd-rise-chi.vercel.app

> Fully functional client-side crowdfunding platform deployed on Vercel.
------------

## 🌐 Deployment

This project is optimized for static deployment:

* ✅ Vercel-ready
* ✅ No backend required
* ✅ Uses `index.html` as entry

---

## 👨‍💻 Author

**Abdulrahman Ali**

---

## 📄 License

This project is built for educational and portfolio purposes.
