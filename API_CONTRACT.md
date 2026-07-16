# Event Planner Platform — API Contract (v1)

This file is the single source of truth for how the **frontend**, **backend**, and **database** connect.
Every layer must be built to match this document exactly. If a layer needs to change something here,
update this file first, then update the code — never let the layers silently drift apart.

---

## 1. Tech Stack Reference

| Layer | Tech |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Spring Boot (Java) |
| Database | MongoDB (Atlas) |
| Auth | JWT + Spring Security |
| AI Assistant | Gemini API |
| Payments | Razorpay |
| Deployment | Frontend → Vercel, Backend → Render, DB → MongoDB Atlas |

---

## 2. Environment Variables (Backend)

```
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRATION_MS=86400000
GEMINI_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
FRONTEND_ORIGIN=https://your-app.vercel.app
```

## 2b. Environment Variables (Frontend)

```
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_RAZORPAY_KEY_ID=
```

---

## 3. Auth Flow

1. Frontend calls `POST /api/auth/register` or `/api/auth/login`.
2. Backend returns a JWT.
3. Frontend stores the JWT and sends it on every request after:
   ```
   Authorization: Bearer <token>
   ```
4. Backend's `JwtAuthFilter` validates the token on every protected route and attaches the user's role
   (`PLANNER`, `VENDOR`, `CLIENT`, `ADMIN`) to the request context.

---

## 4. Data Models (MongoDB Collections)

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "role": "PLANNER | VENDOR | CLIENT | ADMIN",
  "createdAt": "ISODate"
}
```

### Vendor
```json
{
  "id": "string",
  "userId": "string",
  "businessName": "string",
  "category": "VENUE | CATERING | DECOR | AV | OTHER",
  "priceRange": { "min": 0, "max": 0 },
  "description": "string",
  "portfolioImages": ["string"],
  "averageRating": 0.0,
  "status": "PENDING | APPROVED | REJECTED",
  "createdAt": "ISODate"
}
```

### Event
```json
{
  "id": "string",
  "plannerId": "string",
  "clientEmail": "string",
  "title": "string",
  "targetBudget": 0,
  "totalCost": 0,
  "status": "DRAFT | PENDING_APPROVAL | APPROVED | COMPLETED",
  "vendors": [
    { "vendorId": "string", "agreedPrice": 0, "locked": false }
  ],
  "clientLinkToken": "string",
  "createdAt": "ISODate"
}
```

### Message
```json
{
  "id": "string",
  "eventId": "string",
  "senderId": "string",
  "receiverId": "string",
  "content": "string",
  "aiGenerated": false,
  "sentAt": "ISODate"
}
```

### Payment
```json
{
  "id": "string",
  "eventId": "string",
  "payerId": "string",
  "payeeId": "string",
  "amount": 0,
  "type": "CLIENT_TO_PLATFORM | PLATFORM_TO_VENDOR",
  "status": "PENDING | SUCCESS | FAILED | REFUNDED",
  "gatewayOrderId": "string",
  "gatewayPaymentId": "string",
  "createdAt": "ISODate"
}
```

### Review
```json
{
  "id": "string",
  "eventId": "string",
  "vendorId": "string",
  "reviewerId": "string",
  "rating": 0,
  "comment": "string",
  "createdAt": "ISODate"
}
```

---

## 5. API Endpoints

### Auth
| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password, role }` | `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |

### Vendors
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/vendors?category=&search=` | Public listing, filterable |
| GET | `/api/vendors/{id}` | Vendor profile |
| POST | `/api/vendors` | Vendor creates own profile (auth: VENDOR) |
| PATCH | `/api/vendors/{id}` | Vendor updates own profile |

### Events / Package Builder
| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/events` | `{ title, targetBudget, clientEmail }` (auth: PLANNER) |
| GET | `/api/events/{id}` | Full event with vendor list + live totals |
| PATCH | `/api/events/{id}/vendors` | `{ action: "ADD"/"REMOVE"/"SWAP", vendorId, replaceVendorId? }` — triggers budget recalculation |
| POST | `/api/events/{id}/submit-for-approval` | Moves status to PENDING_APPROVAL, generates client link |
| GET | `/api/events/client-view/{clientLinkToken}` | Public, no auth — client views package |
| POST | `/api/events/client-view/{clientLinkToken}/approve` | Client approves → status = APPROVED |

### Chat / AI Assistant
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/chat/{eventId}/messages` | Message history between planner & vendor |
| POST | `/api/chat/{eventId}/messages` | Send a message |
| POST | `/api/ai/draft-message` | `{ eventId, vendorId, goal }` → calls Gemini, returns suggested text |

### Payments
| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/payments/initiate` | `{ eventId, amount, type }` → creates Razorpay order, returns `orderId` + public key to frontend |
| POST | `/api/payments/verify` | `{ orderId, paymentId, signature }` → frontend confirms after checkout closes |
| POST | `/api/payments/webhook` | **Public**, called by Razorpay directly — source of truth for final payment status, not the frontend |
| GET | `/api/payments/event/{eventId}` | Payment history for an event |

### Reviews
| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/reviews` | `{ eventId, vendorId, rating, comment }` — only after event status = COMPLETED |
| GET | `/api/vendors/{id}/reviews` | List reviews for a vendor |

### Admin
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/vendors/pending` | Vendor applications awaiting approval |
| PATCH | `/api/admin/vendors/{id}/status` | `{ status: "APPROVED"/"REJECTED" }` |

---

## 6. Standard Response Wrapper (every endpoint)

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Errors follow the same shape with `"success": false` and a `data: null`, plus an appropriate HTTP status
(400, 401, 403, 404, 409, 500).

---

## 7. Payment Flow (Critical — read carefully)

1. Client clicks "Approve & Pay" → frontend calls `POST /api/payments/initiate`.
2. Backend creates a Razorpay order **server-side** (secret key never touches frontend) and returns
   `{ orderId, amount, currency, razorpayKeyId }`.
3. Frontend opens Razorpay checkout widget using that data.
4. On success, frontend calls `POST /api/payments/verify` with the signature — this updates UI optimistically only.
5. **Razorpay also calls `POST /api/payments/webhook` independently.** This webhook call is the only
   thing allowed to mark a payment as `SUCCESS` in the database, because the frontend's browser could
   close before step 4 completes. The webhook handler must verify the Razorpay signature before trusting it.
6. On confirmed success, backend updates `Event.status` and recalculates `Event.totalCost` paid-so-far.

---

## 8. CORS Rule (Backend)

Only allow origin = `FRONTEND_ORIGIN` env variable. Do not use `*` once payments are involved.

---

## 9. Rules Both Sides Must Follow

- Frontend never hardcodes API URLs — always reads `VITE_API_BASE_URL`.
- Frontend never receives or stores the Razorpay secret key — only the public key ID.
- Backend never returns password hashes in any response.
- Any change to a request/response shape in this file must be updated here **before** either side changes code.
