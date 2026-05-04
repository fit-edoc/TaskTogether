# 🚀 TaskTogether - SaaS Project Management Dashboard

TaskTogether is a modern, full-stack Role-Based Project & Task Management SaaS application built with the **MERN** stack (MongoDB, Express, React/Next.js, Node.js). 

It empowers teams to collaborate effectively with clear role separation, allowing Admins to oversee project timelines and Member progress, while keeping Members focused entirely on completing their specific assignments.

---

## ✨ Key Features

### 🛡️ Role-Based Access Control
- **Global Roles**: Users are registered as `member` or `admin`.
- **Project Context**: Admins can create and manage full projects. Members are invited to projects and can only view data relevant to their assigned tasks.

### 👑 Admin Capabilities
- **Create & Manage Projects**: Spin up new projects and maintain full control over the lifecycle.
- **Manage Members**: Instantly search the user directory to add new members to a project.
- **Task Assignment**: Create tasks with titles, descriptions, due dates, and priorities (Low, Medium, High) and assign them to specific members.
- **Live Team Progress**: A dedicated dashboard section tracks the completion percentage and active progress bar of every member in the project in real-time.
- **Analytics Overview**: View project-wide stats including Total Tasks, Completed, Overdue, and In-Progress numbers.

### 👤 Member Capabilities
- **Focused Workspace**: No distracting analytics or management tools. Members only see their specific assigned tasks.
- **Status Updates**: Members can easily transition their assigned tasks between `Todo`, `In-Progress`, and `Done`.

### ⚡ Real-Time Synchronization
- **Background Polling**: Task status updates made by members reflect automatically on the Admin dashboard within seconds without requiring manual page refreshes.

---

## 🛠️ Technology Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (App Router)
- React
- Tailwind CSS
- Axios (API Client)

**Backend:**
- Node.js & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & Mongoose
- JWT (JSON Web Tokens) for Authentication
- Bcrypt.js (Password Hashing)

---

## 📂 Project Structure

```text
etharaai/
├── client/                 # Next.js Frontend
│   ├── app/                # App Router (Pages & Layouts)
│   │   ├── (auth)/         # Login & Registration Pages
│   │   └── dashboard/      # Protected Admin/Member Dashboards
│   ├── components/         # Reusable React Components
│   ├── context/            # Global Auth State (AuthContext)
│   ├── services/           # Axios API route wrappers
│   └── lib/                # API configurations
│
└── server/                 # Express/Node Backend
    ├── config/             # Database configurations
    ├── controller/         # Logic for Auth, Projects, Tasks, and Dashboards
    ├── middleware/         # JWT Auth, Role Checking, & Request Validation
    ├── models/             # Mongoose Schemas (User, Project, Task)
    ├── routes/             # API Endpoints
    └── server.js           # Main Express application entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection URI

### 1. Backend Setup
Navigate to the `server/` directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server/` root:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
Navigate to the `client/` directory and install dependencies:
```bash
cd client
npm install
```
Start the Next.js development server:
```bash
npm run dev
```

### 3. Usage & Testing
1. Visit `http://localhost:3000` and register a new user. 
2. **Important**: By default, new users are assigned the `member` role. To test Admin features (like creating a project), manually change the user's role in your MongoDB database from `"member"` to `"admin"`.
3. Create a project, search for other registered users, and assign them tasks!

---

## 🔒 API Endpoints

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/users`
- **Projects:** `GET /api/projects`, `POST /api/projects/create-project`, `POST /api/projects/:id/add-member`, `DELETE /api/projects/:id/remove-member/:userId`
- **Tasks:** `GET /api/tasks/get-task`, `POST /api/tasks/createTask`, `PATCH /api/tasks/update-task/:id`, `DELETE /api/tasks/delete-task/:id`
- **Dashboard:** `GET /api/dashboard`
