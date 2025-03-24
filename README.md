# Library Management System (MERN Stack)

## 📌 Project Overview
The **Library Management System** is a full-stack web application built using the **MERN stack (MongoDB, Express.js, React, Node.js)**. It enables library admins to manage books and users to search boooks according to their interests
---

## 🏗️ Project Structure
```
📂 library-management-system
│── 📂 client      # React frontend
│── 📂 server      # Node.js & Express backend
│── 📄 README.md   # Project documentation
```

- **client/** → React frontend (Vite)
- **server/** → Node.js backend with Express.js & MongoDB

---

## 🚀 Features
- **User Authentication** (JWT-based login, signup, Google authentication)
- **Role-Based Access Control** (Admin & Member)
- **Book Management** (Add, update, delete books, search by name & publisher)
- **Email Notifications** (Mailtrap API for welcome emails notifications)
- **Redis Integration** (Used for refresh token caching  management)

---

## 🛠️ Tech Stack
### **Frontend (Client)**
- React.js (Vite for fast development)
- React Router (Navigation management)
- Zustand (State management & data fetching)
- Tailwind CSS (Styling framework)

### **Backend (Server)**
- Node.js with Express.js
- MongoDB with Mongoose (NoSQL database)
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

```

---

## 📬 API Routes
### **Authentication Routes**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/auth/signup` | Register a new user |
| POST   | `/auth/login` | Login user & get tokens |
| POST   | `/auth/refresh-token` | Get new access token |
| POST   | `/auth/forget-password` | get password reset email |
| POST   | `/auth/reset-password` | reset password  |
| POST   | `/auth/verify-email` | verify the email after signup |

### **Book Routes**



