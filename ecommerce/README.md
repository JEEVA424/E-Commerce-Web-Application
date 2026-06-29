# 🛒 E-Commerce Store — Full Stack Application

A complete, production-ready e-commerce web application built with React.js, Node.js, Express, and MySQL (Prisma ORM).

---

## 🚀 Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router  |
| Backend   | Node.js, Express.js, REST API               |
| Database  | MySQL + Prisma ORM                          |
| Auth      | JWT + bcrypt                                |
| Security  | Helmet, CORS, Rate Limiting, express-validator |

---

## ✨ Features

- 🔐 JWT Authentication (Register / Login / Protected Routes)
- 👤 Role-Based Access Control (Admin / User)
- 🛍️ Full Product CRUD with image upload
- 🛒 Shopping Cart with real-time totals (tax + shipping)
- 💳 Dummy Checkout & Order Placement
- 📦 Order Management with status tracking
- 📊 Admin Dashboard with stats & low-stock alerts
- 🌙 Dark Mode
- 📱 Fully Responsive Design
- 🔍 Product Search, Filter, Sort & Pagination

---

## 📁 Project Structure

```
ecommerce/
├── server/                  # Express backend
│   ├── config/              # DB, JWT, Multer config
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, validation, error handlers
│   ├── routes/              # API routes
│   ├── prisma/              # Schema & seed
│   ├── uploads/             # Uploaded images
│   ├── app.js               # Express app
│   └── server.js            # Entry point
│
└── client/                  # React frontend
    └── src/
        ├── components/      # Reusable UI components
        ├── context/         # Auth, Cart, Theme context
        ├── pages/           # All pages
        ├── routes/          # Protected/Admin routes
        ├── services/        # Axios API calls
        └── layouts/         # Main & Admin layouts
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repo-url>
cd ecommerce
```

### 2. Backend Setup

```bash
cd server
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
node prisma/seed.js

# Start the backend
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 4. Access the App

| URL                          | Description       |
|------------------------------|-------------------|
| http://localhost:5173        | Frontend App      |
| http://localhost:5000/api    | Backend API       |
| http://localhost:5000/api/health | Health Check |

---

## 🔑 Demo Credentials

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@store.com    | admin123  |
| User  | user@store.com     | user123   |

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile       (Protected)
PUT    /api/auth/profile       (Protected)
PUT    /api/auth/change-password (Protected)
```

### Products
```
GET    /api/products           ?page=1&limit=12&search=&category=&minPrice=&maxPrice=&sort=&order=&featured=
GET    /api/products/:id
GET    /api/products/brands
POST   /api/products           (Admin)
PUT    /api/products/:id       (Admin)
DELETE /api/products/:id       (Admin)
```

### Cart
```
GET    /api/cart               (Protected)
POST   /api/cart               (Protected)
PUT    /api/cart/:id           (Protected)
DELETE /api/cart/:id           (Protected)
DELETE /api/cart/clear         (Protected)
```

### Orders
```
POST   /api/orders             (Protected)
GET    /api/orders             (Protected)
GET    /api/orders/:id         (Protected)
PUT    /api/orders/:id/cancel  (Protected)
```

### Admin
```
GET    /api/admin/dashboard    (Admin)
GET    /api/admin/orders       (Admin)
PUT    /api/admin/orders/:id   (Admin)
GET    /api/admin/users        (Admin)
```

---

## 🗄️ Database Schema (ER Diagram)

```
Users ─────┬──── Cart ──── CartItems ──── Products ──── Categories
           │                                │
           └──── Orders ──── OrderItems ────┘
           │
           └──── Wishlists ──── Products
```

### Tables
- **users** — id, name, email, password, role, phone, address, city, state, zipCode, country
- **categories** — id, name, description, image
- **products** — id, name, description, price, stock, brand, image, rating, numReviews, isFeatured, categoryId
- **carts** — id, userId
- **cart_items** — id, cartId, productId, quantity
- **orders** — id, userId, status, totalAmount, taxAmount, shippingAmount, grandTotal, shippingAddress, ...
- **order_items** — id, orderId, productId, quantity, price
- **wishlists** — id, userId, productId

---

## 🔒 Security Features

- JWT token authentication with expiry
- bcrypt password hashing (salt rounds: 12)
- Helmet HTTP headers
- CORS with whitelist
- Rate limiting (100 req/15min general, 20 req/15min auth)
- Input validation via express-validator
- SQL injection protection via Prisma ORM
- Role-based route protection

---

## 🚢 Deployment

### Backend (e.g., Railway, Render, Heroku)
1. Set environment variables from `.env.example`
2. Run `npm install && npx prisma generate && npx prisma migrate deploy`
3. Start with `npm start`

### Frontend (e.g., Vercel, Netlify)
1. Update `vite.config.js` proxy to point to deployed backend URL
2. Or set `VITE_API_URL` env var and update `src/services/api.js`
3. Run `npm run build` — deploy the `dist/` folder

---

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="mysql://user:password@localhost:3306/ecommerce_db"

# JWT
JWT_SECRET=your_super_secret_key_32_chars_min
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Upload
MAX_FILE_SIZE=5242880
```

---

Built with ❤️ using React + Node.js + Prisma
