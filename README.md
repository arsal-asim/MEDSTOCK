# 💊 MedStock — Pharmacy Inventory Finance Management System

A full-stack MERN web application for small pharmacies to manage inventory requests on short-term credit, track order status in real time, and manage repayments.

---

## 🚀 Live Links

| Service | URL |
|---|---|
| Frontend (Vercel) | _Add your Vercel URL here_ |
| Backend API (Render) | _Add your Render URL here_ |
| API Health Check | _Render URL_/api/health |

---

## 👥 Group Members

| Name | Roll No. |
|---|---|
| Rida Nadeem | 23i-5523 |
| Hammad Ahsan | 23i-5537 |
| Arsal Asim | 23i-5528 |

**University:** FAST University Islamabad  
**Program:** FinTech — Semester 6  
**Course:** Web Engineering / MERN Stack

---

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router DOM, Axios, React Hot Toast, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs

---

## 📁 Project Structure

```
medstock/
├── medstock-backend/
│   └── backend/
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middlewares/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── app.js
│       │   └── server.js
│       ├── .env.example
│       └── package.json
│
└── medstock-frontend/
    └── frontend/
        ├── src/
        │   ├── pages/
        │   ├── components/
        │   ├── context/
        │   ├── services/
        │   └── App.jsx
        ├── .env.example
        └── package.json
```

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/medstock.git
cd medstock
```

### 2. Backend setup
```bash
cd medstock-backend/backend
npm install
```
Create `.env`:
```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/medstock
JWT_SECRET=any_random_secret_string
JWT_EXPIRES_IN=7d
PORT=5000
```
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd medstock-frontend/frontend
npm install
```
Create `.env`:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

### 4. Open browser
Visit `http://localhost:5173`

---

## 🔑 Default Admin Credentials

| Field | Value |
|---|---|
| Email | admin@medstock.com |
| Password | admin123 |

---

## 📡 Key API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Protected |
| GET | /api/requests | Pharmacy |
| POST | /api/requests | Pharmacy |
| GET | /api/repayments | Pharmacy |
| GET | /api/admin/dashboard | Admin |
| GET | /api/admin/requests | Admin |
| PUT | /api/admin/requests/:id | Admin |
| PUT | /api/admin/repayments/:id/paid | Admin |
| GET | /api/health | Public |