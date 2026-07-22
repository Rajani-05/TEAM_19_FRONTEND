#  EventPro — Event Planning Platform Frontend

---

This is the complete React + Tailwind CSS frontend for the **Event Planning Marketplace Platform**. It matches the backend API contract exactly and integrates authentication, budget builders, Gemini AI negotiation assistants, and Razorpay payments.

---
# Live demo :
# Application	Render URL	Status
🎨 Production Frontend	https://team-19-frontend.onrender.com	# Active on Render Cloud


## 🛠️ Technology Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss` integration)
- **Routing**: React Router v6
- **API Client**: Axios (configured with request JWT interception and global 401 response handling)
- **Iconography**: Lucide React
- **Payments**: Razorpay Checkout widget

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):


- `VITE_API_BASE_URL`: Base address of the Spring Boot backend.
- `VITE_RAZORPAY_KEY_ID`: Your public Razorpay API key ID (never include secret keys in frontend configurations).

---

## 📂 Project Directory Structure

```
src/
├── main.jsx, App.jsx
├── api/
│   ├── axiosClient.js       (base Axios instance, intercepts JWT and 401s)
│   ├── authApi.js           (login, register)
│   ├── vendorApi.js         (get directory, update business profiles)
│   ├── eventApi.js          (builder slots, client view, submissions)
│   ├── chatApi.js           (live polling, AI drafted counters)
│   ├── paymentApi.js        (initiate Razorpay order, verify signature, audits)
│   ├── reviewApi.js         (submit ratings & comments)
│   └── adminApi.js          (users list, vendor moderation queues)
├── context/
│   └── AuthContext.jsx      (state-based, in-memory JWT session storage)
├── components/
│   ├── layout/              (Layout, ProtectedRoute, RoleRoute)
│   ├── vendor/              (VendorCard, VendorFilterBar)
│   ├── event/               (BudgetSummaryBar, VendorSlotCard)
│   ├── chat/                (MessageBubble, AIAssistantButton)
│   └── common/              (Modal, Toast, LoadingSpinner, ErrorBanner)
├── pages/
│   ├── public/              (Landing, Login, Register, Unauthorized, 404)
│   ├── planner/             (Dashboard, VendorDirectory, Profile, CreateEvent, Builder, Chat, Audits, Review)
│   ├── vendor/              (Dashboard, Profile Settings, Chat, Payouts)
│   ├── client/              (ClientPackageView, ClientApprovePay)
│   └── admin/               (Dashboard, UserManagement, VendorModeration)
└── routes/
    └── AppRoutes.jsx         (React Router mapping)
```

---

## ⚡ Execution Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open **http://localhost:5173** to view the application.

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   Compiles optimized production assets to the `dist/` directory.
