# 🎌 JKT48 E-Commerce Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://mysql.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-red.svg)](https://socket.io)

Backend RESTful API untuk sistem e-commerce JKT48 merchandise yang dibangun dengan Express.js, Sequelize ORM, MySQL, dan Socket.IO untuk fitur real-time chat.

## 📋 Daftar Isi

- [🚀 Fitur Utama](#-fitur-utama)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Struktur Project](#-struktur-project)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [📚 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [💬 Real-time Features](#-real-time-features)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🚀 Fitur Utama

### 👨‍💼 Admin Features

- ✅ **Product Management** - CRUD produk dengan kategori, varian, dan gambar
- ✅ **Order Management** - Kelola pesanan dan status pengiriman
- ✅ **Payment Verification** - Approve/reject pembayaran transfer
- ✅ **Real-time Notifications** - Notifikasi pesanan dan pembayaran baru
- ✅ **Live Chat** - Chat real-time dengan customer
- ✅ **Analytics Dashboard** - Statistik penjualan dan revenue

### 👥 Customer Features

- ✅ **Authentication** - Register, login, dan manajemen profil
- ✅ **Product Catalog** - Browse produk dengan filter kategori
- ✅ **Shopping Cart** - Tambah, edit, hapus item keranjang
- ✅ **Checkout System** - Proses pemesanan dengan alamat pengiriman
- ✅ **Payment System** - Upload bukti transfer dan konfirmasi
- ✅ **Order Tracking** - Lacak status pesanan dengan nomor resi
- ✅ **Review System** - Beri rating dan review produk
- ✅ **Live Chat** - Chat dengan admin untuk bantuan

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.1.0
- **Database:** MySQL 8.0+
- **ORM:** Sequelize 6.37.7
- **Authentication:** JWT (jsonwebtoken)
- **Real-time:** Socket.IO 4.8.1
- **Security:** Helmet, bcryptjs
- **Validation:** express-validator
- **File Upload:** Multer
- **Logging:** Morgan
- **Environment:** dotenv

## 📁 Struktur Project

```
backend/
├── 📁 config/          # Konfigurasi database dan environment
│   └── database.js     # Koneksi Sequelize ke MySQL
├── 📁 controllers/     # Business logic dan handler endpoint
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── reviewController.js
│   ├── messageController.js
│   └── userController.js
├── 📁 middlewares/     # Custom middleware functions
│   ├── auth.js         # JWT authentication & authorization
│   └── upload.js       # File upload configuration
├── 📁 models/          # Database models (Sequelize)
│   ├── index.js        # Model associations
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── payment.js
│   ├── cart.js
│   └── ...
├── 📁 routes/          # API route definitions
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── ...
├── 📄 app.js           # Main application entry point
├── 📄 package.json     # Dependencies dan scripts
├── 📄 .env             # Environment variables (tidak di-commit)
├── 📄 .gitignore       # Files/folders yang diabaikan Git
└── 📄 README.md        # Dokumentasi project
```

## ⚙️ Installation

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/) atau gunakan [Laragon](https://laragon.org))
- Git ([Download](https://git-scm.com))

### Steps

1. **Clone repository:**

```bash
git clone https://github.com/RendiS10/backend-ecommerce.git
cd backend-ecommerce
```

2. **Install dependencies:**

```bash
npm install
```

3. **Setup database:**

```sql
-- Buat database di MySQL
CREATE DATABASE jkt48_merchandise_db;
```

4. **Setup environment variables:**

```bash
# Copy file .env.example ke .env
cp .env.example .env
```

## 🔧 Configuration

Buat file `.env` di root folder dengan konfigurasi berikut:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jkt48_merchandise_db
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di: `http://localhost:5000`

### Testing API

Gunakan Postman atau tools serupa untuk testing endpoint.
Base URL: `http://localhost:5000/api`

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile

```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "John Doe Updated",
  "phone_number": "081234567890",
  "address": "Jl. Sudirman No. 123",
  "city": "Jakarta",
  "postal_code": "12345"
}
```

### 📦 Product Endpoints

#### Get All Products

```http
GET /api/products
```

#### Get Product by ID

```http
GET /api/products/:id
```

#### Search Products

```http
GET /api/products/search?q=keyword&category=1&min_price=10000&max_price=500000
```

#### Create Product (Admin)

```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "product_name": "JKT48 T-Shirt",
  "description": "Official JKT48 merchandise",
  "price": 150000,
  "category_id": 1,
  "stock": 100,
  "image_url": "https://example.com/image.jpg"
}
```

#### Update Product (Admin)

```http
PUT /api/products/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "product_name": "JKT48 T-Shirt Updated",
  "price": 175000,
  "stock": 80
}
```

#### Delete Product (Admin)

```http
DELETE /api/products/:id
Authorization: Bearer {admin_token}
```

### 📂 Category Endpoints

#### Get All Categories

```http
GET /api/categories
```

#### Create Category (Admin)

```http
POST /api/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "category_name": "T-Shirts",
  "slug": "t-shirts",
  "image_url": "https://example.com/category.jpg"
}
```

#### Update Category (Admin)

```http
PUT /api/categories/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "category_name": "T-Shirts Updated",
  "slug": "t-shirts-updated"
}
```

#### Delete Category (Admin)

```http
DELETE /api/categories/:id
Authorization: Bearer {admin_token}
```

### 🛒 Cart Endpoints

#### Get User Cart

```http
GET /api/cart
Authorization: Bearer {token}
```

#### Add to Cart

```http
POST /api/cart
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": 1,
  "variant_id": 2,
  "quantity": 2
}
```

#### Update Cart Item

```http
PUT /api/cart/:cart_item_id
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart

```http
DELETE /api/cart/:cart_item_id
Authorization: Bearer {token}
```

### 📋 Order Endpoints

#### Get User Orders

```http
GET /api/orders
Authorization: Bearer {token}
```

#### Get All Orders (Admin)

```http
GET /api/orders/all
Authorization: Bearer {admin_token}
```

#### Create Order

```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shipping_address": {
    "full_name": "John Doe",
    "phone_number": "081234567890",
    "address": "Jl. Sudirman No. 123",
    "city": "Jakarta",
    "postal_code": "12345"
  },
  "payment_method": "transfer",
  "notes": "Tolong kirim cepat",
  "cart_items": [
    {
      "product_id": 1,
      "variant_id": 2,
      "quantity": 2,
      "price": 150000
    }
  ]
}
```

#### Cancel Order

```http
PATCH /api/orders/:order_id/cancel
Authorization: Bearer {token}
```

#### Confirm Order Received

```http
PATCH /api/orders/:order_id/confirm-received
Authorization: Bearer {token}
```

#### Update Order Status (Admin)

```http
PATCH /api/orders/:order_id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "order_status": "Dikirim",
  "tracking_number": "JNE123456789"
}
```

#### Get Pending Notifications (Admin)

```http
GET /api/orders/notifications
Authorization: Bearer {admin_token}
```

### 💳 Payment Endpoints

#### Get User Payments

```http
GET /api/payments
Authorization: Bearer {token}
```

#### Get All Payments (Admin)

```http
GET /api/payments/all
Authorization: Bearer {admin_token}
```

#### Get Payment by Order ID

```http
GET /api/payments/order/:order_id
Authorization: Bearer {token}
```

#### Confirm Payment

```http
PUT /api/payments/:payment_id/confirm
Authorization: Bearer {token}
Content-Type: application/json

{
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_name": "John Doe",
  "payment_date": "2025-08-22T10:30:00Z",
  "transfer_proof": "https://example.com/proof.jpg"
}
```

#### Approve Payment (Admin)

```http
PUT /api/payments/:payment_id/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "admin_notes": "Pembayaran valid dan telah diverifikasi"
}
```

#### Reject Payment (Admin)

```http
PUT /api/payments/:payment_id/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "admin_notes": "Bukti transfer tidak valid"
}
```

### ⭐ Review Endpoints

#### Get Product Reviews

```http
GET /api/reviews/:product_id
```

#### Create Review

```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 1,
  "product_id": 1,
  "rating": 5,
  "comment": "Produk bagus dan sesuai ekspektasi!"
}
```

#### Get Reviewable Products for Order

```http
GET /api/reviews/order/:order_id/reviewable
Authorization: Bearer {token}
```

### 💬 Message Endpoints (Live Chat)

#### Get Message History

```http
GET /api/messages
Authorization: Bearer {token}
```

#### Get Chat Users (Admin)

```http
GET /api/messages/chat-users
Authorization: Bearer {admin_token}
```

#### Send Message (HTTP Fallback)

```http
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Halo, saya butuh bantuan",
  "recipient_id": 1
}
```

#### Mark Messages as Read

```http
PUT /api/messages/mark-read
Authorization: Bearer {token}
Content-Type: application/json

{
  "message_ids": [1, 2, 3]
}
```

### 👥 User Management (Admin)

#### Get All Users

```http
GET /api/users
Authorization: Bearer {admin_token}
```

#### Update User Role

```http
PUT /api/users/:user_id/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User

```http
DELETE /api/users/:user_id
Authorization: Bearer {admin_token}
```

## 🗄️ Database Schema

### Core Tables

#### users

```sql
- user_id (PK, INT, AUTO_INCREMENT)
- full_name (VARCHAR 100, NOT NULL)
- email (VARCHAR 100, UNIQUE, NOT NULL)
- password (VARCHAR 255, NOT NULL)
- role (ENUM: 'admin', 'customer', DEFAULT 'customer')
- phone_number (VARCHAR 20)
- address (TEXT)
- city (VARCHAR 100)
- postal_code (VARCHAR 10)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### product_categories

```sql
- category_id (PK, INT, AUTO_INCREMENT)
- category_name (VARCHAR 100, UNIQUE, NOT NULL)
- slug (VARCHAR 100, UNIQUE, NOT NULL)
- image_url (VARCHAR 255)
```

#### products

```sql
- product_id (PK, INT, AUTO_INCREMENT)
- product_name (VARCHAR 200, NOT NULL)
- description (TEXT)
- price (DECIMAL 10,2, NOT NULL)
- stock (INT, DEFAULT 0)
- category_id (FK -> product_categories)
- image_url (VARCHAR 255)
- main_image (VARCHAR 255)
- is_active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### product_variants

```sql
- variant_id (PK, INT, AUTO_INCREMENT)
- product_id (FK -> products)
- size (VARCHAR 10)
- color (VARCHAR 50)
- variant_stock (INT, DEFAULT 0)
- price_adjustment (DECIMAL 10,2, DEFAULT 0)
```

#### orders

```sql
- order_id (PK, INT, AUTO_INCREMENT)
- user_id (FK -> users)
- total_amount (DECIMAL 10,2, NOT NULL)
- order_status (ENUM: 'Menunggu Konfirmasi', 'Disetujui', 'Akan Dikirimkan', 'Dikirim', 'Selesai', 'Dibatalkan')
- payment_method (VARCHAR 50)
- shipping_address (TEXT)
- shipping_city (VARCHAR 100)
- shipping_postal_code (VARCHAR 10)
- tracking_number (VARCHAR 100)
- notes (TEXT)
- order_date (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### order_items

```sql
- order_item_id (PK, INT, AUTO_INCREMENT)
- order_id (FK -> orders)
- product_id (FK -> products)
- variant_id (FK -> product_variants)
- quantity (INT, NOT NULL)
- price_at_purchase (DECIMAL 10,2, NOT NULL)
```

#### payments

```sql
- payment_id (PK, INT, AUTO_INCREMENT)
- order_id (FK -> orders)
- user_id (FK -> users)
- payment_amount (DECIMAL 10,2, NOT NULL)
- payment_method (VARCHAR 50)
- payment_status (ENUM: 'Menunggu Konfirmasi', 'Disetujui', 'Ditolak')
- bank_name (VARCHAR 100)
- account_number (VARCHAR 50)
- account_name (VARCHAR 100)
- transfer_proof (VARCHAR 255)
- admin_notes (TEXT)
- payment_date (TIMESTAMP)
- confirmation_date (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### carts

```sql
- cart_id (PK, INT, AUTO_INCREMENT)
- user_id (FK -> users, UNIQUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### cart_items

```sql
- cart_item_id (PK, INT, AUTO_INCREMENT)
- cart_id (FK -> carts)
- product_id (FK -> products)
- variant_id (FK -> product_variants)
- quantity (INT, NOT NULL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### reviews

```sql
- review_id (PK, INT, AUTO_INCREMENT)
- user_id (FK -> users)
- product_id (FK -> products)
- order_id (FK -> orders)
- rating (INT, 1-5, NOT NULL)
- comment (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### messages

```sql
- message_id (PK, INT, AUTO_INCREMENT)
- sender_id (FK -> users)
- recipient_id (FK -> users)
- message (TEXT, NOT NULL)
- is_read (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Database Relationships

```
users (1) ←→ (N) orders
users (1) ←→ (1) carts
users (1) ←→ (N) payments
users (1) ←→ (N) reviews
users (1) ←→ (N) messages

product_categories (1) ←→ (N) products
products (1) ←→ (N) product_variants
products (1) ←→ (N) order_items
products (1) ←→ (N) cart_items
products (1) ←→ (N) reviews

orders (1) ←→ (N) order_items
orders (1) ←→ (1) payments
orders (1) ←→ (N) reviews

carts (1) ←→ (N) cart_items
```

## 🔐 Authentication & Authorization

### JWT Token Structure

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "customer",
  "iat": 1692691200,
  "exp": 1693296000
}
```

### Middleware Protection

- **Public Endpoints:** `/api/auth/login`, `/api/auth/register`, `/api/products` (GET), `/api/categories` (GET)
- **Customer Protected:** `/api/cart/*`, `/api/orders/*`, `/api/payments/*`, `/api/reviews/*`
- **Admin Protected:** `/api/users/*`, `/api/products/*` (POST/PUT/DELETE), `/api/categories/*` (POST/PUT/DELETE)

### Role-based Access Control

```javascript
// Customer dapat:
- Akses produk dan kategori (read-only)
- Kelola cart, order, payment sendiri
- Buat review untuk produk yang sudah dibeli
- Chat dengan admin

// Admin dapat:
- CRUD produk, kategori, varian
- Kelola semua orders dan payments
- Approve/reject pembayaran
- Chat dengan semua customer
- Akses analytics dan reports
```

## 💬 Real-time Features

### Socket.IO Events

#### Client → Server

```javascript
// Join chat room
socket.emit("join_chat", {
  userId: 1,
  userRole: "customer",
  userName: "John Doe",
});

// Send message
socket.emit("send_message", {
  recipientId: 2,
  message: "Hello admin!",
});
```

#### Server → Client

```javascript
// New message received
socket.on("new_message", (data) => {
  console.log("New message:", data.message);
});

// Customer online (for admin)
socket.on("customer_online", (data) => {
  console.log("Customer online:", data.userName);
});

// Online customers list (for admin)
socket.on("online_customers", (customers) => {
  console.log("Online customers:", customers);
});
```

### Real-time Notifications

- **Order Notifications:** Admin menerima notifikasi real-time ketika ada pesanan baru
- **Payment Notifications:** Admin menerima notifikasi ketika customer upload bukti pembayaran
- **Message Notifications:** User menerima notifikasi chat real-time

## 🚀 Deployment

### Environment Setup

```bash
# Set environment to production
NODE_ENV=production

# Use production database
DB_HOST=your-production-db-host
DB_NAME=your-production-db-name
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password

# Set strong JWT secret
JWT_SECRET=your-super-secure-jwt-secret-for-production

# Set production port
PORT=80
```

### PM2 Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start app.js --name "jkt48-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO support
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Gunakan ESLint untuk code formatting
- Tulis test untuk fitur baru
- Update dokumentasi jika diperlukan
- Follow conventional commit messages

### Code Style

```javascript
// Use camelCase for variables and functions
const userName = "john_doe";

// Use PascalCase for classes and components
class UserController {
  async getUsers() {
    // Implementation
  }
}

// Use UPPER_CASE for constants
const JWT_SECRET = process.env.JWT_SECRET;

// Always use async/await instead of promises
const getUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
```

---

## 📞 Support

Jika ada pertanyaan atau issues:

- **Email:** [your-email@example.com](mailto:your-email@example.com)
- **GitHub Issues:** [Create Issue](https://github.com/RendiS10/backend-ecommerce/issues)

---

**Made with ❤️ for JKT48 Fans by [RendiS10](https://github.com/RendiS10)**
