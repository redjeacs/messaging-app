# 🗨️ Message App

A full-stack messaging app with secure user authentication and registration user relational storage. This is the initial template for the messaging component in my Social App project.

## 🌐 Social App Repo
👉 **[View the Completed Project](https://github.com/redjeacs/social-app)**

<p>
   <a href="https://github.com/redjeacs/social-app">
     <img width="1920" height="1080" alt="Screenshot 2026-08-01 163856" src="https://github.com/user-attachments/assets/ac2f0a41-d81a-4807-8162-bd5987b579ef" />
   </a>
</p>

---

## 🏗️ Architecture

This project is decoupled into two dedicated system directories:

*   **Frontend (/client):** React, Vite (Hot Module Replacement), ESLint optimization, HTML5, CSS, and TailwindCSS styling frameworks.
*   **Backend (/api):** Node.js, Express framework, Prisma ORM, PostgreSQL database, Json Web Tokens authentication, Bcrypt password hashing, and Cloudinary cloud storage.

## ✨ Core Project Features

This application implements a secure user authentication and registration using jwt tokens and end to end direct messaging with stored friends list.

*   **User Authentication**: Fully secure user registration and authentication process utilizing bcrypt for password hasing and jwt for route security.
*   **Friends List**: A sidebar with stored user friends list as well as the ability to add more users to the list.
*   **Direct Messaging**: End to end direct messaging with users in the friend list with the ability to delete your messages freely.
*   **Profile Updates**: A profile page with implementation of user profile editing on profile pictures, email, and username stored in database and cloudinary cloud storage.

---

## 🛠️ Tech Stack

### 🛡️ Backend API Engine (`/api`)
- **Runtime Environment:** Node.js (v22+)
- **Server Framework:** Express.js (v5.1 REST Router architecture)
- **Database Engine & Hosting:** PostgreSQL managed via **Supabase**
- **Object-Relational Mapping (ORM):** Prisma ORM v7 (with native Driver Adapters)

### 🎨 Frontend Client Layer (`/client`)
*   **Core UI Engine:** [React](https://react.dev) – Component-driven runtime interface mapping data onto an interactive Virtual DOM.
*   **Build Automation Tooling:** [Vite](https://vite.dev) – Next-generation bundling setup providing instantaneous Hot Module Replacement (HMR).
*   **Styling Engine:** HTML5, CSS3, and TailwindCSS ensuring responsive design across desktop, tablet, and mobile displays.

---

## 💻 Local Installation & Setup

Follow these steps to run this application locally on your computer:

### 1. Clone the Repository
```bash
git clone https://github.comd/redjeacs/messaging-app
cd messaging-app
```

### 2. Install Project Dependencies
```bash
cd api
npm install
cd ../client
npm install
```

### 3. Setup Your Environment Variables
Create a file named `.env` in both the api and client directory of your project and configure your local or cloud keys:

/api
```env

#  JWT Setup
JWT_SECRET="[your_jwt_secret]"

#  Cloudinary Variables
CLOUDINARY_NAME="[your_cloudinary_name]"
CLOUDINARY_API_KEY="[your_cloudinary_api_key"
CLOUDINARY_API_SECRET="[your_cloudinary_api_secret]"

# Database Connections
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/[YOUR_LOCAL_DB]"

# Server Port
PORT=8080
```

/client
```env
# API URL
VITE_API_URL='http://localhost:8080/api' ## Change it to your deployment url after production
```


### 4. Push the Prisma Schema to Your Database
Use the explicit environment loader to build out your four operational database model tables:
```bash
cd api
npx prisma db push
npx prisma generate
```

### 5. Launch the Local Development Servers
```bash
# run your development script on both directories
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---
