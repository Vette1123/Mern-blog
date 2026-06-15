# 📰 MERN Blog

> Full-stack blogging platform with JWT auth, social features and S3-backed image uploads — React + Node + Express + MongoDB.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.8-764ABC?logo=redux&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)

A learning-focused MERN stack blog (2022) covering the full path from auth and account verification to posts, comments and social interactions. Backend is a vanilla Express + Mongoose REST API; frontend is a Create React App SPA with Redux Toolkit and Tailwind.

## ✨ Features

- **Auth** — register, login, JWT sessions, password hashing with bcrypt
- **Account verification & password reset** — token-based flow with SendGrid email delivery
- **Posts** — create, read, update, delete, with categories, cover image, views counter
- **Likes / dislikes** — toggle reactions on posts
- **Comments** — full CRUD on post comments
- **Categories** — admin-only management (create / update / list)
- **User profiles** — bio, profile picture upload to **AWS S3** via `multer` + `aws-sdk`
- **Social graph** — follow / unfollow users
- **Admin controls** — block / unblock users, protected admin routes
- **Pagination** middleware for the posts list
- **Profanity filter** on content (`bad-words`)
- Centralised error handling and async wrapper

## 🛠️ Tech Stack

- **Frontend** — React 18, React Router 6, Redux Toolkit, Tailwind CSS, MUI, Formik, react-toastify, react-dropzone, axios
- **Backend** — Node.js, Express, `express-async-handler`, CORS
- **Database** — MongoDB via Mongoose 6
- **Auth** — JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Storage** — AWS S3 (image uploads) via `multer` + `aws-sdk`
- **Email** — SendGrid (`@sendgrid/mail`)

## 📁 Project Structure

```
Mern-blog/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # users, posts, comments, categories, emails
│   ├── middlewares/    # auth, upload (multer), pagination, errors
│   ├── models/         # User, Post, Comment, Category, Email
│   ├── routes/         # /api/users, /api/posts, /api/comments, ...
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/ # auth, post, comment, category, profile, navigation
    │   ├── pages/
    │   ├── redux/      # Redux Toolkit slices
    │   └── App.js
    └── tailwind.config.js
```

## 📖 Getting Started

### Prerequisites

- Node.js 16+
- A MongoDB instance (local or Atlas)
- AWS S3 bucket + IAM credentials (for image uploads)
- SendGrid API key (for verification & reset emails)

### Install

```bash
# from the repo root — installs backend deps
npm install

# install frontend deps
cd frontend && npm install && cd ..
```

### Run (dev)

```bash
# starts backend (nodemon) and frontend (CRA) concurrently
npm run dev
```

Or run them individually:

```bash
npm run server   # backend on http://localhost:5555
npm run client   # frontend on http://localhost:3000
```

### Environment variables

Copy `.env.sample` to `.env` in the repo root and fill in:

```env
MONGO_URI=
PORT=
JWT_SECRET=
JWT_EXPIRATION_DURATION=
SENDGRID_API_KEY=
AWS_BUCKET_NAME=
AWS_BUCKET_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

## 🔌 API Overview

| Resource     | Base path         | Notes                                                 |
| ------------ | ----------------- | ----------------------------------------------------- |
| Users        | `/api/users`      | register, login, follow/unfollow, block, profile pic  |
| Posts        | `/api/posts`      | CRUD, likes, dislikes, paginated list                 |
| Comments     | `/api/comments`   | CRUD on post comments                                 |
| Categories   | `/api/categories` | admin-managed                                         |
| Emails       | `/api/emails`     | verification + password reset via SendGrid            |

## 🙌 Credits

Built by [Mohamed Gado](https://mohamedgado.com).
