💰 Expense Tracker (MERN + Firebase + Vercel)

A full-stack expense tracking web application built with React (Vite), Express, and Firebase Firestore, deployed on Vercel.

🚀 Features

✅ User authentication (Firebase)
✅ Add / edit / delete categories and budgets
✅ Track income and expenses
✅ Visual budget insights and progress tracking
✅ Responsive design using Tailwind CSS + shadcn/ui
✅ Firebase Firestore backend for secure, real-time data
✅ Deployed seamlessly on Vercel (frontend + backend)

🗂️ Project Structure
expense-tracker/
│
├── backend/                   # Express + Firebase Admin API
│   ├── config/
│   │   ├── env.js
│   │   └── firebase-service.json (DO NOT COMMIT)
│   ├── routes/
│   ├── controllers/
│   ├── index.js               # Main Express entry point
│   ├── package.json
│
├── frontend/expense-tracker/  # React + Vite Frontend
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── vercel.json                # Handles both backend + frontend builds
├── .env                       # Local environment variables

⚙️ Environment Variables
In Vercel → Project Settings → Environment Variables
Variable	Description
PORT	Backend port (e.g., 5500)
FIREBASE_PROJECT_ID	Your Firebase project ID
FIREBASE_CLIENT_EMAIL	From Firebase Admin SDK
FIREBASE_PRIVATE_KEY	Private key (escape \n as \\n)


🧩 Local Development
1. Clone Repo
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker

2. Backend Setup
cd backend
npm install
npm run dev

3. Frontend Setup
cd ../frontend/expense-tracker
npm install
npm run dev


Frontend runs on http://localhost:5173

Backend runs on http://localhost:5500

🌍 Deployment (Vercel)

The project uses monorepo deployment on Vercel — both backend and frontend are deployed together using vercel.json.

✅ vercel.json
{
  "version": 2,
  "builds": [
    { "src": "backend/index.js", "use": "@vercel/node" },
    {
      "src": "frontend/expense-tracker/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "frontend/expense-tracker/dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/index.js" },
    { "src": "/(.*)", "dest": "frontend/expense-tracker/$1" }
  ]
}

Steps:

Push your latest code to GitHub.

Go to Vercel → Import Project → GitHub → Select repo.

Set Root Directory = repo root (not frontend).

Add environment variables.

Deploy 🚀

Vercel will automatically build both backend (/api) and frontend.


🧑‍💻 Tech Stack

Frontend: React + TypeScript + Vite + Tailwind CSS 

Backend: Express.js + Firebase Admin SDK

Database: Firebase Firestore

Deployment: Vercel
