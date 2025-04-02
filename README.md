cd# Library Management System 

## 📌 Project Overview

## The **Library Management System** is a full-stack web application built using the **Express.js, React, Node.js and MySql as Database**. It enables library admins to manage books and their inventory and users to search boooks according to their interests and make reservations for them.

## 🏗️ Project Structure

```
📂 library-management-system
│── 📂 client      # React frontend
│── 📂 server      # Node.js & Express backend
│── 📄 README.md   # Project documentation
```

- **client/** → React frontend (Vite)
- **server/** → Node.js backend with Express.js & MySql

---

## 🚀 Features

- **User Authentication** (JWT-based login, signup, verify email, Google OAuth support)
- **Role-Based Access Control** (Admin & Member)
- **Book Management** (Add, update, delete books for admins, search books by title, author & category for users)
- **Reservation Management** (users can create reservations for books, admins can update and manage those reservation status along with add fines if reservations are overdue)
- **Reportings** (admins can get a report of books that are borrowed from the library)
- **Email Notifications** (Mailtrap API for welcome emails, forget password and password reset success notifications)
- **Redis Integration** (Used for refresh token caching management)

---

## 🛠️ Tech Stack

### **Frontend (Client)**

- React.js (Vite for fast development)
- React Router (Navigation management)
- Zustand (State management & data fetching)
- Tailwind CSS (Styling framework)
- Shadcn UI Library

### **Backend (Server)**

- Node.js with Express.js
- Mysql Database
- JWT Authentication (Access & refresh tokens)
- Mailtrap (Email notifications)
- Redis (Token caching)

---

## 📦 Installation & Setup

### 1️⃣ **Clone the Repository**

```sh
$ git clone https://github.com/your-username/library-management-system.git
$ cd library-management-system
```

### 2️⃣ **Set Up the Backend (Server)**

```sh
$ cd server
$ npm install  # Install dependencies
$ npm start    # Start the backend server
```

### 3️⃣ **Set Up the Frontend (Client)**

```sh
$ cd ../client
$ npm install  # Install dependencies
$ npm run dev  # Start the frontend
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the **server/** directory and add the following values:

```env
PORT = 5050
MONGO_URI = your mongodb url
ACCESS_TOKEN_SECRET = your secret
REFRESH_TOKEN_SECRET = your secret
REDIS_URL = your upstash redis db url
CLIENT_URL = your client url ex - (http://localhost:5173/)

MAILTRAP_CLIENT = your mailtrap endpoint
MAILTRAP_API_KEY = your mailtrap api secret key

COULDINARY_CLOUD_NAME = your cloudinary cloud name
CLOUDINARY_API_KEY = cloudinary api key
CLOUDINARY_API_SECRET = cloudinary api secret



Create a another  `.env` file inside the *client/** directory and add the following values:

```env
VITE_FIREBASE_API_KEY = your firebase project api
VITE_FIREBASE_AUTH_DOMAIN = your firebase project auth domain




