# Zorvyn - Modern Financial Management Dashboard

![Zorvyn Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3)

Zorvyn is a premium, high-performance financial management platform built with focus on rich aesthetics, intuitive user experience, and a robust server-side architecture. It provides users with a comprehensive dashboard to track income, manage expenses, and analyze financial health through dynamic visualizations.

## 🚀 Key Features

-   **Secure Authentication**: robust JWT-based authentication system featuring registration, login, email verification, and password recovery workflows.
-   **Financial Dashboard**: Real-time summary statistics and interactive charts for tracking monthly trends and category distributions.
-   **Advanced Record Management**: Comprehensive CRUD operations for transactions with server-side pagination, multi-criteria filtering, and live search.
-   **User Administration**: Role-based access control (RBAC) allowing admins to manage user permissions (Admin, Analyst, Viewer) and account statuses.
-   **Modern Tech Stack**: Leveraging Next.js 16 (Turbopack) and React 19 for a lightning-fast, edge-compatible application.
-   **Server Actions Architecture**: A modern backend-less architecture where all data operations are handled via secure Next.js Server Actions, eliminating the need for client-side API clients like Axios.

## 🛠️ Technology Stack

-   **Framework**: [Next.js 16.2 (App Router)](https://nextjs.org/)
-   **Logic**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Animations**: [Lucide React Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
-   **Authentication**: [jose](https://github.com/panva/jose), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
-   **Mailing**: [Nodemailer](https://nodemailer.com/)

## 📂 Project Structure

```text
zorvyn/
├── frontend/             # Primary Application (Next.js)
│   ├── app/              # App Router (Pages, Layouts, Metadata)
│   │   ├── (protected)/  # Authenticated Dashboard Routes
│   │   ├── (public)/     # Auth Flow (Login, Signup, Recovery)
│   │   └── api/          # (Migrated) Previous API Routes
│   ├── components/       # UI Components (Shadcn, Custom)
│   ├── lib/              # Core Utilities
│   │   ├── actions/      # Next.js Server Actions (Auth, Records, Users)
│   │   ├── services/     # Service Layer Abstractions
│   │   ├── auth.ts       # Authentication Helpers
│   │   └── db.ts         # Database Connection (Mongoose)
│   ├── models/           # Mongoose Schemas (User, Record)
│   └── public/           # Static Assets
└── README.md             # Project Documentation
```

## ⚙️ Getting Started

### Prerequisites

-   Node.js 18+ 
-   MongoDB Database (Cloud or Local)
-   SMTP Server for emails (Gmail App Password recommended)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/zorvyn.git
    cd zorvyn/frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the `frontend` directory and populate it with the following:
    ```env
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    REFRESH_SECRET=your_refresh_secret
    EMAIL_USER=your_email@gmail.com
    APP_PASSWORD=your_gmail_app_password
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    npm run start
    ```

## 🔐 Security Concepts

-   **HTTP-Only Cookies**: JWT tokens (Access & Refresh) are stored in secure, http-only cookies to prevent XSS attacks.
-   **Role-Based Access Control**: Middleware protected routes ensure that only authorized users can access sensitive dashboard sections.
-   **Password Hashing**: User passwords are encrypted using `bcryptjs` with a cost factor of 10.
-   **CSRF Protection**: Native Next.js protection for Server Actions.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the Zorvyn Team.
