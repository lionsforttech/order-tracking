# Order Tracking System

A modern, full-stack order management and tracking system built with enterprise-grade technologies. This application provides comprehensive order lifecycle management, from creation to delivery, with built-in invoice generation, document management, and real-time status tracking.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Authentication & Security](#authentication--security)
- [File Upload System](#file-upload-system)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

The Order Tracking System is a production-ready application designed for businesses that need to manage orders, suppliers, forwarders, and invoices in a single unified platform. Built with a monorepo architecture using pnpm workspaces, it features a RESTful API backend and a modern React-based frontend.

### What Makes This System Professional?

- **Type-Safe Development**: End-to-end TypeScript implementation ensures code reliability and developer productivity
- **Database-First Approach**: Prisma ORM with PostgreSQL provides robust data modeling and type-safe database queries
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Document Management**: Professional file upload system with validation, UUID naming, and secure storage
- **Scalable Architecture**: Monorepo structure with clear separation of concerns
- **Production Ready**: Docker support, environment-based configuration, and comprehensive error handling

---

## Technology Stack

### Backend (API)

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 11.0.1 | Enterprise Node.js framework providing modular architecture, dependency injection, and built-in support for TypeScript |
| **Prisma** | 7.2.0 | Next-generation ORM for type-safe database access with automatic migrations and client generation |
| **PostgreSQL** | 16 | Robust relational database with excellent performance, ACID compliance, and UUID support |
| **Passport JWT** | 4.0.1 | Authentication middleware implementing JSON Web Token strategy for secure API access |
| **Bcrypt** | 6.0.0 | Industry-standard password hashing algorithm (with salt rounds) for secure credential storage |
| **Multer** | 2.0.2 | Middleware for handling multipart/form-data, used for document uploads with disk storage |
| **Class Validator** | 0.14.3 | Decorator-based validation library ensuring data integrity at the DTO level |
| **Class Transformer** | 0.5.1 | Object transformation library for serialization and deserialization |
| **UUID** | 13.0.0 | Universal unique identifier generation for secure file naming and primary keys |

### Frontend (Web)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework with App Router, server components, and built-in API routes |
| **React** | 19.2.3 | Modern UI library with hooks, context, and component-based architecture |
| **TypeScript** | 5.x | Strongly-typed JavaScript providing compile-time error detection and IntelliSense |
| **Tailwind CSS** | 4.x | Utility-first CSS framework for rapid, responsive UI development |
| **Radix UI** | Latest | Accessible, unstyled component primitives (Dialog, Select, Dropdown, etc.) |
| **Lucide React** | 0.562.0 | Beautiful, consistent icon library with 1000+ icons |
| **shadcn/ui** | - | Component library built on Radix UI and Tailwind CSS for professional interfaces |

### Development & DevOps

| Technology | Purpose |
|------------|---------|
| **pnpm** | Fast, disk-efficient package manager with workspace support for monorepos |
| **Docker Compose** | Container orchestration for PostgreSQL database in development |
| **ESLint** | Code quality and consistency enforcement with TypeScript support |
| **Prettier** | Opinionated code formatter ensuring consistent style across the codebase |
| **Jest** | Testing framework for unit and integration tests |

---

## System Architecture

### Monorepo Structure

The project uses a **monorepo architecture** managed by pnpm workspaces, providing:

- **Shared Dependencies**: Common packages installed once at the root level
- **Independent Deployment**: Each app can be built and deployed separately
- **Code Reusability**: Shared types and utilities between frontend and backend
- **Simplified Development**: Single repository for the entire stack

```
order-tracking/
├── apps/
│   ├── api/          # NestJS backend application
│   └── web/          # Next.js frontend application
├── package.json      # Root workspace configuration
└── pnpm-workspace.yaml
```

### Backend Architecture (NestJS)

The API follows a **modular architecture** with clear separation of concerns:

```
src/
├── auth/             # Authentication (JWT strategy, guards, login)
├── users/            # User management
├── orders/           # Order CRUD operations
├── invoices/         # Invoice management and document handling
├── suppliers/        # Supplier management
├── forwarders/       # Forwarder management
├── prisma/           # Database service (singleton pattern)
├── health/           # Health check endpoint
└── main.ts           # Application bootstrap
```

**Key Architectural Patterns:**

- **Dependency Injection**: All services are injectable, promoting testability
- **Module Encapsulation**: Each feature is a self-contained module
- **DTOs (Data Transfer Objects)**: Request/response validation and type safety
- **Guards & Strategies**: Centralized authentication and authorization
- **Exception Filters**: Consistent error handling across all endpoints

### Frontend Architecture (Next.js)

The web app uses **Next.js App Router** with a component-based structure:

```
app/
├── dashboard/        # Main application pages
│   ├── page.tsx     # Dashboard with statistics
│   ├── orders/      # Orders management
│   ├── invoices/    # Invoices management
│   ├── suppliers/   # Suppliers management
│   └── forwarders/  # Forwarders management
├── login/           # Authentication page
└── layout.tsx       # Root layout with metadata
```

**Components Organization:**

- **Server Components**: Default for better performance and SEO
- **Client Components**: Interactive components with useState, useEffect
- **Reusable UI Components**: Buttons, dialogs, tables in `components/ui/`
- **Feature Components**: Domain-specific components (orders-table, order-dialog)

### Data Flow

1. **Client Request**: User interacts with Next.js frontend
2. **API Route**: Request sent to Next.js API route (`/app/api/...`)
3. **Token Forwarding**: JWT token extracted from cookies and sent to backend
4. **NestJS Controller**: Handles request, validates with DTOs
5. **Service Layer**: Business logic execution
6. **Prisma ORM**: Type-safe database queries
7. **PostgreSQL**: Data persistence
8. **Response**: JSON data flows back through the same chain

---

## Key Features

### Order Management

- ✅ **Full CRUD Operations**: Create, read, update, and delete orders
- ✅ **Pagination & Search**: Efficient data handling with server-side pagination and real-time search
- ✅ **Status Tracking**: Five-stage order lifecycle (Draft, Placed, In Transit, Delivered, Canceled)
- ✅ **Inline Entity Creation**: Create suppliers and forwarders on-the-fly during order creation
- ✅ **Date Tracking**: Order date, dispatch date, estimated delivery, and actual delivery
- ✅ **Reference Numbers**: Unique, auto-generated reference numbers for each order

### Invoice Management

- ✅ **Invoice Generation**: Create invoices standalone or automatically during order creation
- ✅ **Document Uploads**: Attach multiple documents (PDF, images, Word, Excel) to invoices
- ✅ **Inline Invoice Creation**: Checkbox option to create invoice simultaneously with order
- ✅ **Document Download**: Secure file download with proper content-type headers
- ✅ **File Validation**: Type and size validation (10MB limit) with professional error handling

### Supplier & Forwarder Management

- ✅ **CRUD Operations**: Full management of suppliers and freight forwarders
- ✅ **Unique Validation**: Prevent duplicate supplier/forwarder names
- ✅ **Relationship Tracking**: View all orders associated with each supplier/forwarder
- ✅ **Inline Creation**: Add new suppliers/forwarders without leaving the order form

### Dashboard & Analytics

- ✅ **Real-Time Statistics**: Total orders, in-transit orders, and delivered orders
- ✅ **Recent Orders**: Quick view of the latest orders with status
- ✅ **Quick Actions**: Direct navigation to create new orders, invoices, suppliers

### User Experience

- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Inline Error Handling**: Contextual error messages in forms (no intrusive toasts)
- ✅ **Accessible Components**: WCAG-compliant UI components from Radix UI
- ✅ **Custom Status Badges**: Color-coded status indicators (Blue: Placed, Green: Delivered, etc.)
- ✅ **Page-Specific Titles**: SEO-friendly metadata for each route
- ✅ **Loading States**: Visual feedback during asynchronous operations

### Security Features

- ✅ **JWT Authentication**: Secure token-based authentication with configurable expiration
- ✅ **Password Hashing**: Bcrypt with salt rounds for secure password storage
- ✅ **Protected Routes**: All API endpoints require valid authentication tokens
- ✅ **File Upload Security**: Type validation, size limits, and UUID-based file naming
- ✅ **SQL Injection Prevention**: Parameterized queries through Prisma ORM
- ✅ **CORS Configuration**: Controlled cross-origin resource sharing

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Purpose | Download Link |
|----------|----------------|---------|---------------|
| **Node.js** | 20.x | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 10.27.0 | Package manager | [pnpm.io](https://pnpm.io/) |
| **PostgreSQL** | 16.x | Database server | [postgresql.org](https://www.postgresql.org/) |
| **Docker** (optional) | 20.x | Container runtime for local DB | [docker.com](https://www.docker.com/) |

### Optional but Recommended

- **Git**: Version control (comes with macOS/Linux)
- **VS Code**: Code editor with excellent TypeScript support
- **Postman/Insomnia**: API testing tools
- **Prisma Studio**: Visual database management (`npx prisma studio`)

### Verification Commands

```bash
# Check Node.js version
node --version  # Should be v20.x or higher

# Check pnpm version
pnpm --version  # Should be 10.27.0 or higher

# Check PostgreSQL (if installed locally)
psql --version  # Should be 16.x

# Check Docker (if using Docker)
docker --version && docker-compose --version
```

---

## Local Development Setup

Follow these steps to get the project running on your local machine.

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>
cd order-tracking
```

### Step 2: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

This command installs dependencies for:
- Root workspace
- Backend API (`apps/api`)
- Frontend Web (`apps/web`)

### Step 3: Set Up PostgreSQL Database

You have two options: **Docker** (recommended) or **Local PostgreSQL**.

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify container is running
docker ps
```

This creates a PostgreSQL 16 container with:
- **Database Name**: `order_tracking`
- **User**: `app`
- **Password**: `app`
- **Port**: `5432`

#### Option B: Using Local PostgreSQL

```bash
# Create database (macOS/Linux)
createdb order_tracking

# Or using psql
psql -U postgres
CREATE DATABASE order_tracking;
\q
```

### Step 4: Configure Environment Variables

#### Backend (.env for API)

Create environment file for the API:

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env` with your configuration:

```env
# Database Connection
DATABASE_URL="postgresql://app:app@localhost:5432/order_tracking"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"
```

**Important Notes:**
- Change `JWT_SECRET` to a strong, random string in production
- Adjust `DATABASE_URL` if using different credentials
- Use `localhost` for local Docker or local PostgreSQL

#### Frontend (.env for Web)

Create environment file for the web app:

```bash
cd apps/web
cp .env.example .env
```

Edit `apps/web/.env`:

```env
# API Backend URL
NEXT_PUBLIC_API_URL="http://localhost:3001"

# For production, use your actual API domain:
# NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
```

### Step 5: Run Database Migrations

```bash
# Navigate to API directory
cd apps/api

# Run Prisma migrations (creates all tables)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

This creates the following tables:
- `users` - User accounts
- `suppliers` - Supplier records
- `forwarders` - Freight forwarder records
- `orders` - Order records
- `invoices` - Invoice records
- `invoice_documents` - Document attachments

### Step 6: Seed Initial Data (Optional)

Create an admin user manually:

```bash
# Open Prisma Studio
npx prisma studio
```

Or use `psql` to insert an admin user:

```sql
INSERT INTO users (id, email, password, name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$YourHashedPasswordHere', -- Use bcrypt to hash "admin123"
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);
```

**To generate a bcrypt hash:**

```bash
# Using Node.js
node -e "console.log(require('bcrypt').hashSync('admin123', 10))"
```

### Step 7: Start Development Servers

Open **two terminal windows**:

#### Terminal 1: Start Backend API

```bash
# From root directory
cd apps/api
pnpm dev

# Or from root with workspace command
pnpm --filter api dev
```

The API will start on **http://localhost:3001**

#### Terminal 2: Start Frontend

```bash
# From root directory
cd apps/web
pnpm dev

# Or from root
pnpm --filter web dev
```

The web app will start on **http://localhost:3000**

### Step 8: Verify Installation

1. **Open Browser**: Navigate to http://localhost:3000
2. **Login Page**: You should see the login page
3. **Login**: Use the admin credentials you created
4. **Dashboard**: After login, you should see the dashboard with statistics

#### Health Check Endpoints

```bash
# Check API health
curl http://localhost:3001/health

# Response: { "status": "ok" }
```

### Step 9: Explore the Application

- **Dashboard**: View order statistics and recent orders
- **Orders**: Create, view, edit, and delete orders
- **Invoices**: Manage invoices and upload documents
- **Suppliers**: Manage supplier records
- **Forwarders**: Manage forwarder records

---

## Production Deployment

### Backend Deployment

#### 1. Environment Configuration

Create production `.env` file in `apps/api`:

```env
# Production Database (use managed PostgreSQL service)
DATABASE_URL="postgresql://username:password@production-host:5432/dbname"

# Strong JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="<STRONG_RANDOM_SECRET_HERE>"
JWT_EXPIRES_IN="7d"

# Production Settings
PORT=3001
NODE_ENV="production"
```

#### 2. Build the API

```bash
cd apps/api

# Install production dependencies only
pnpm install --prod

# Build TypeScript to JavaScript
pnpm build

# Run database migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

#### 3. Start Production Server

```bash
# Start with Node.js
node dist/main.js

# Or with PM2 (recommended)
pm2 start dist/main.js --name order-tracking-api

# Or with pnpm
pnpm start:prod
```

#### 4. Deployment Options

**Option A: Traditional VPS (DigitalOcean, Linode, AWS EC2)**

```bash
# Install Node.js, pnpm, PostgreSQL on server
# Clone repository
# Follow build steps above
# Use PM2 or systemd for process management
# Set up Nginx as reverse proxy
```

**Option B: Platform-as-a-Service (Heroku, Railway, Render)**

- Connect GitHub repository
- Set environment variables in platform dashboard
- Platform automatically detects NestJS and builds
- Configure build command: `cd apps/api && pnpm install && pnpm build`
- Configure start command: `node apps/api/dist/main.js`

**Option C: Docker Deployment**

Create `Dockerfile` in `apps/api`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod
COPY . .
RUN pnpm build
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### Frontend Deployment

#### 1. Environment Configuration

Create production `.env` in `apps/web`:

```env
# Production API URL
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
```

#### 2. Build the Frontend

```bash
cd apps/web

# Install dependencies
pnpm install

# Build for production
pnpm build

# Test production build locally
pnpm start
```

#### 3. Deployment Options

**Option A: Vercel (Recommended for Next.js)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or connect GitHub repository via Vercel dashboard
```

Vercel Configuration:
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Environment Variable**: `NEXT_PUBLIC_API_URL`

**Option B: Netlify**

- Connect GitHub repository
- Set base directory: `apps/web`
- Build command: `pnpm build`
- Publish directory: `.next`
- Add environment variables

**Option C: Self-Hosted with PM2**

```bash
cd apps/web
pnpm build

# Start with PM2
pm2 start npm --name order-tracking-web -- start

# Or direct Node.js
node .next/standalone/server.js
```

### Nginx Reverse Proxy (Optional)

If self-hosting both API and frontend:

```nginx
# /etc/nginx/sites-available/order-tracking

# API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Web Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable sites and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/order-tracking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Database Backup

```bash
# Automated daily backups
0 2 * * * pg_dump -U app order_tracking > /backups/order_tracking_$(date +\%Y\%m\%d).sql
```

---

## Project Structure

```
order-tracking/
│
├── apps/
│   │
│   ├── api/                          # NestJS Backend API
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema definition
│   │   │   └── migrations/           # Database migration history
│   │   │
│   │   ├── src/
│   │   │   ├── auth/                 # Authentication module
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.guard.ts      # JWT authentication guard
│   │   │   │   ├── jwt.strategy.ts   # Passport JWT strategy
│   │   │   │   └── dto/
│   │   │   │       └── login.dto.ts
│   │   │   │
│   │   │   ├── users/                # User management
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── dto/
│   │   │   │
│   │   │   ├── orders/               # Order management
│   │   │   │   ├── orders.controller.ts
│   │   │   │   ├── orders.service.ts
│   │   │   │   ├── orders.module.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-order.dto.ts
│   │   │   │       └── update-order.dto.ts
│   │   │   │
│   │   │   ├── invoices/             # Invoice & document management
│   │   │   │   ├── invoices.controller.ts
│   │   │   │   ├── invoices.service.ts
│   │   │   │   ├── invoice-documents.controller.ts
│   │   │   │   ├── invoices.module.ts
│   │   │   │   └── dto/
│   │   │   │
│   │   │   ├── suppliers/            # Supplier management
│   │   │   ├── forwarders/           # Forwarder management
│   │   │   ├── prisma/               # Database service
│   │   │   │   ├── prisma.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   │
│   │   │   ├── health/               # Health check
│   │   │   ├── app.module.ts         # Root application module
│   │   │   └── main.ts               # Application entry point
│   │   │
│   │   ├── uploads/                  # File storage directory
│   │   │   └── invoices/             # Invoice documents
│   │   │
│   │   ├── test/                     # E2E tests
│   │   ├── .env                      # Environment variables (gitignored)
│   │   ├── .env.example              # Environment template
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Next.js Frontend
│       ├── app/
│       │   ├── dashboard/            # Protected dashboard routes
│       │   │   ├── page.tsx          # Dashboard home with stats
│       │   │   ├── layout.tsx        # Dashboard layout
│       │   │   │
│       │   │   ├── orders/           # Orders management
│       │   │   │   ├── page.tsx
│       │   │   │   └── layout.tsx    # Page-specific metadata
│       │   │   │
│       │   │   ├── invoices/         # Invoices management
│       │   │   ├── suppliers/        # Suppliers management
│       │   │   └── forwarders/       # Forwarders management
│       │   │
│       │   ├── login/                # Authentication page
│       │   │   └── page.tsx
│       │   │
│       │   ├── api/                  # Next.js API routes (proxy to backend)
│       │   │   ├── auth/
│       │   │   ├── orders/
│       │   │   ├── invoices/
│       │   │   ├── suppliers/
│       │   │   └── forwarders/
│       │   │
│       │   ├── layout.tsx            # Root layout
│       │   ├── page.tsx              # Landing/redirect page
│       │   └── globals.css           # Global styles
│       │
│       ├── components/
│       │   ├── ui/                   # Reusable UI components (shadcn)
│       │   │   ├── button.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── input.tsx
│       │   │   ├── select.tsx
│       │   │   └── ... (30+ components)
│       │   │
│       │   ├── orders/               # Order-specific components
│       │   │   ├── orders-table.tsx
│       │   │   ├── order-dialog.tsx
│       │   │   └── order-status-badge.tsx
│       │   │
│       │   ├── invoices/             # Invoice components
│       │   ├── suppliers/            # Supplier components
│       │   └── forwarders/           # Forwarder components
│       │
│       ├── types/                    # TypeScript type definitions
│       │   ├── orders.ts
│       │   ├── invoices.ts
│       │   └── ...
│       │
│       ├── lib/                      # Utility functions
│       │   └── utils.ts
│       │
│       ├── .env                      # Environment variables (gitignored)
│       ├── .env.example              # Environment template
│       ├── next.config.ts            # Next.js configuration
│       ├── tailwind.config.ts        # Tailwind CSS configuration
│       └── package.json
│
├── .gitignore
├── docker-compose.yml                # PostgreSQL container
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml               # pnpm workspace config
├── pnpm-lock.yaml                    # Dependency lock file
└── README.md                         # This file
```

---

## Database Schema

The application uses a well-structured relational database with the following tables:

### Users Table

Stores user accounts with hashed passwords.

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Suppliers Table

Manages supplier information.

```prisma
model Supplier {
  id        String   @id @default(uuid())
  name      String   @unique
  orders    Order[]  // One-to-many relationship
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Forwarders Table

Manages freight forwarder information.

```prisma
model Forwarder {
  id        String   @id @default(uuid())
  name      String   @unique
  orders    Order[]  // One-to-many relationship
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Orders Table

Core table storing order information.

```prisma
model Order {
  id                    String      @id @default(uuid())
  refNumber             String      @unique
  supplierId            String      // Foreign key
  supplier              Supplier    @relation(...)
  forwarderId           String?     // Optional foreign key
  forwarder             Forwarder?  @relation(...)
  status                OrderStatus @default(DRAFT)
  orderDate             DateTime?
  dispatchDate          DateTime?
  estimatedDeliveryDate DateTime?
  actualDeliveryDate    DateTime?
  shipmentName          String?
  comments              String?
  invoices              Invoice[]   // One-to-many
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
}

enum OrderStatus {
  DRAFT
  PLACED
  IN_TRANSIT
  DELIVERED
  CANCELED
}
```


### Invoices Table

Invoice records linked to orders.

```prisma
model Invoice {
  id            String   @id @default(uuid())
  orderId       String   // Foreign key
  order         Order    @relation(...)
  invoiceNumber String
  invoiceDate   DateTime?
  documents     InvoiceDocument[] // One-to-many
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Invoice Documents Table

File attachments for invoices.

```prisma
model InvoiceDocument {
  id           String   @id @default(uuid())
  invoiceId    String   // Foreign key
  invoice      Invoice  @relation(..., onDelete: Cascade)
  filename     String   // UUID-based filename
  originalName String   // User's original filename
  filepath     String   // Disk storage path
  mimetype     String   // MIME type
  size         Int      // File size in bytes
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Entity Relationship Diagram

```
User (standalone)

Supplier ──< Order >── Forwarder
             │
             │
             └──< Invoice ──< InvoiceDocument
```

**Key Relationships:**

- **Supplier → Orders**: One-to-many (a supplier can have multiple orders)
- **Forwarder → Orders**: One-to-many (a forwarder can handle multiple orders)
- **Order → Invoices**: One-to-many (an order can have multiple invoices)
- **Invoice → Documents**: One-to-many (an invoice can have multiple documents)

**Cascade Delete:**

- Deleting an order deletes its invoices, and documents
- Deleting an invoice deletes its documents
- Suppliers/Forwarders are protected (cannot delete if they have orders)

---

## API Documentation

### Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.yourdomain.com`

### Authentication

All endpoints except `/auth/login` require a JWT token in the `Authorization` header.

```bash
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login and receive JWT token | No |

**Login Request:**

```json
POST /auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Login Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get paginated orders (supports search, pagination) |
| GET | `/orders/:id` | Get single order by ID |
| POST | `/orders` | Create new order |
| PATCH | `/orders/:id` | Update existing order |
| DELETE | `/orders/:id` | Delete order (and related invoices) |
| GET | `/orders/stats` | Get order statistics |

**Get Orders (with pagination):**

```bash
GET /orders?page=1&limit=10&search=REF001
```

**Create Order:**

```json
POST /orders
{
  "refNumber": "REF001",
  "supplierId": "uuid",
  "forwarderId": "uuid",
  "status": "PLACED",
  "orderDate": "2026-01-13T00:00:00.000Z",
  "shipmentName": "Shipment A",
  "comments": "Urgent delivery"
}
```

#### Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | Get paginated invoices |
| GET | `/invoices/:id` | Get single invoice |
| POST | `/invoices` | Create invoice |
| PATCH | `/invoices/:id` | Update invoice |
| DELETE | `/invoices/:id` | Delete invoice |

#### Invoice Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/invoices/:id/documents` | Upload document (multipart/form-data) |
| GET | `/invoices/:id/documents` | List all documents for invoice |
| GET | `/invoices/:invoiceId/documents/:id` | Download specific document |
| DELETE | `/invoices/:invoiceId/documents/:id` | Delete document |

**Upload Document:**

```bash
POST /invoices/{invoiceId}/documents
Content-Type: multipart/form-data

file: [binary file data]
```

#### Suppliers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/suppliers` | Get all suppliers (with pagination) |
| GET | `/suppliers/:id` | Get single supplier |
| POST | `/suppliers` | Create supplier |
| PATCH | `/suppliers/:id` | Update supplier |
| DELETE | `/suppliers/:id` | Delete supplier |

#### Forwarders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forwarders` | Get all forwarders |
| GET | `/forwarders/:id` | Get single forwarder |
| POST | `/forwarders` | Create forwarder |
| PATCH | `/forwarders/:id` | Update forwarder |
| DELETE | `/forwarders/:id` | Delete forwarder |

#### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Check API health status | No |

**For detailed API documentation, see [api.md](./api.md)**

---

## Environment Variables

### Backend (apps/api/.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` | Yes |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` (7 days) | Yes |
| `PORT` | API server port | `3001` | No (default: 3001) |
| `NODE_ENV` | Environment mode | `development` or `production` | No |

### Frontend (apps/web/.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` | Yes |

**Security Notes:**

- Never commit `.env` files to version control
- Use `.env.example` as a template
- Generate strong JWT secrets: `openssl rand -base64 32`
- Rotate JWT secrets periodically in production
- Use environment-specific values (dev, staging, prod)

---

## Authentication & Security

### JWT Authentication Flow

1. **User Login**: POST credentials to `/auth/login`
2. **Token Generation**: Backend validates credentials, generates JWT token
3. **Token Storage**: Frontend stores token in HTTP-only cookie (secure)
4. **Authenticated Requests**: Token sent in `Authorization: Bearer <token>` header
5. **Token Verification**: JwtGuard validates token on protected routes
6. **Token Expiration**: Token expires after configured time (default: 7 days)

### Password Security

- **Hashing Algorithm**: bcrypt with 10 salt rounds
- **Never Stored Plain**: Passwords are hashed before database storage
- **Comparison**: bcrypt.compare() for login verification

```typescript
// Password hashing (on user creation)
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification (on login)
const isValid = await bcrypt.compare(password, user.password);
```

### File Upload Security

- **Type Validation**: Only allow specific MIME types (PDF, images, Word, Excel)
- **Size Limit**: 10MB maximum file size
- **Filename Sanitization**: UUID-based filenames prevent path traversal
- **Storage Location**: Files stored outside public web directory
- **Download Security**: Files served with proper content-type headers

**Allowed File Types:**

```typescript
const ALLOWED_TYPES = [
  'application/pdf',                    // PDF
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', // Images
  'application/msword',                 // Word (.doc)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
  'application/vnd.ms-excel',           // Excel (.xls)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Excel (.xlsx)
];
```

### Protected Routes

All routes in `/dashboard/*` require authentication. Unauthorized users are redirected to `/login`.

---

## File Upload System

### Architecture

The document upload system uses **Multer** for handling multipart/form-data with disk storage.

### Storage Configuration

```typescript
storage: diskStorage({
  destination: './uploads/invoices',
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  }
})
```

### Upload Flow

1. **Client**: User selects file in browser
2. **FormData**: File attached to FormData object
3. **Next.js API Route**: Receives file, forwards to NestJS backend
4. **Multer Middleware**: Validates and saves file to disk
5. **Database Record**: Filename, path, size, MIME type stored in `invoice_documents`
6. **Response**: Document metadata returned to client

### Download Flow

1. **Client**: Requests document by ID
2. **Backend**: Retrieves file metadata from database
3. **Stream**: File streamed from disk using `createReadStream`
4. **Headers**: Proper content-type and content-disposition headers
5. **Client**: Browser downloads or displays file

### File Management

```typescript
// Create uploads directory if not exists
if (!existsSync('./uploads/invoices')) {
  mkdirSync('./uploads/invoices', { recursive: true });
}

// Stream file for download
const stream = createReadStream(doc.filepath);
stream.pipe(res);

// Delete file on document deletion
unlinkSync(doc.filepath);
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Failed

**Error**: `Can't reach database server at localhost:5432`

**Solutions:**

```bash
# Check if PostgreSQL is running
docker ps  # For Docker
sudo systemctl status postgresql  # For local install

# Restart PostgreSQL
docker-compose restart  # For Docker
sudo systemctl restart postgresql  # For local install

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

#### 2. Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution:**

```bash
cd apps/api
npx prisma generate
```

#### 3. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=3002
```

#### 4. JWT Token Invalid

**Error**: `401 Unauthorized`

**Solutions:**

- Check if token is expired (re-login)
- Verify `JWT_SECRET` matches between environments
- Clear browser cookies and re-login
- Check token is being sent in Authorization header

#### 5. File Upload Fails

**Error**: `Unexpected field` or `File too large`

**Solutions:**

```bash
# Check file size (max 10MB)
ls -lh <file>

# Verify file type is allowed
file --mime-type <file>

# Ensure uploads directory exists and is writable
mkdir -p apps/api/uploads/invoices
chmod 755 apps/api/uploads/invoices
```

#### 6. CORS Errors

**Error**: `Access to fetch blocked by CORS policy`

**Solution:**

Check CORS configuration in `apps/api/src/main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,
});
```

#### 7. Migration Errors

**Error**: `Migration failed to apply cleanly`

**Solutions:**

```bash
# Check migration status
npx prisma migrate status

# Reset database (DEVELOPMENT ONLY)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name fix_issue
```

#### 8. Build Errors

**Error**: `Module not found` during build

**Solutions:**

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build

# Clear Next.js cache
rm -rf apps/web/.next
```

### Getting Help

- Check [commands.md](./commands.md) for useful commands
- Check browser console for client-side errors
- Check backend terminal for server-side errors
- Use Prisma Studio to inspect database: `npx prisma studio`

---

## License

This project is licensed under the MIT License.

---

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.