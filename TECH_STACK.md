# Grocery Superstore --- Technology Stack

## 1. Frontend

### React

Purpose: - Build component-based UI - Manage application screens -
Handle customer/admin interfaces

### Tailwind CSS

Purpose: - Responsive styling - Consistent design system - Rapid UI
development

### Recommended supporting libraries

#### React Router

For: - Public routes - Customer routes - Admin routes - Protected routes

#### TanStack Query

Recommended for: - API data fetching - Caching - Loading/error states -
Mutations - Query invalidation

This avoids putting all server data into React Context.

#### React Hook Form

Recommended for: - Login - Registration - Checkout - Product forms -
Admin forms

#### Zod

Recommended for: - Frontend form validation - Shared validation patterns
where appropriate

## 2. Backend

### Node.js

Runtime for the API server.

### Express.js

Responsibilities: - Routing - Middleware - Request/response handling -
Authentication middleware - Error handling

### Validation

Use a schema validation library such as Zod or Joi.

The backend must validate all important inputs.

### Authentication

Use: - JWT - bcrypt or Argon2 for password hashing

Do not store plaintext passwords.

## 3. Database

### PostgreSQL

Chosen because: - Strong relational model - Transactions - Foreign
keys - Constraints - Good indexing - Excellent fit for
orders/inventory/payments - Reliable production database

### Database access

Use a PostgreSQL-compatible ORM/query layer such as Prisma or Drizzle.

For this project, Prisma is a reasonable choice because it provides: -
Schema definition - Migrations - Type-safe queries - Clear relationships

However, raw SQL should still be understood for performance/debugging.

## 4. API

Architecture: - REST - JSON - `/api/v1/...`

Example:

``` text
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id

POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id

GET    /api/v1/admin/orders
PATCH  /api/v1/admin/orders/:id/status
```

## 5. Security Libraries / Middleware

Recommended: - Helmet - CORS - Rate limiting - Input validation - Secure
password hashing

Exact configuration should depend on deployment.

## 6. Image Handling

Product images should not be stored directly as large binary values
inside PostgreSQL.

Store: - Image URL - Metadata

Use local storage during development if necessary.

For production, use an object/image storage provider.

## 7. Development Tools

Recommended: - Git - GitHub - ESLint - Prettier - npm - Environment
variables via `.env` - Postman/Insomnia for API testing

## 8. Testing

MVP testing priorities:

### Backend

-   Authentication
-   Product APIs
-   Cart
-   Order creation
-   Inventory
-   Coupon calculation
-   Delivery calculation
-   Authorization

### Frontend

-   Main customer flow
-   Login
-   Product browsing
-   Cart
-   Checkout
-   Admin critical flows

Possible tools: - Vitest/Jest - Supertest - React Testing Library

Do not spend excessive time chasing 100% coverage for an internship MVP.

## 9. Deployment

Possible deployment model:

``` text
React frontend
     |
     v
Static/frontend hosting

Node + Express API
     |
     v
Cloud server/platform

PostgreSQL
     |
     v
Managed PostgreSQL provider
```

The exact hosting provider can be selected later.

## 10. Environment Variables

Example:

``` text
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=

FRONTEND_URL=

PAYMENT_PROVIDER_KEY=
PAYMENT_PROVIDER_SECRET=

IMAGE_STORAGE_URL=
IMAGE_STORAGE_KEY=
IMAGE_STORAGE_SECRET=
```

Never commit `.env` files containing secrets.

## 11. Code Quality Rules

The codebase should follow: - Clear naming - Small focused functions -
Thin controllers - Business logic in services - Reusable React
components - No duplicated API logic - No hard-coded secrets - No
unnecessary abstractions - No giant files - No giant components -
Consistent error handling

The goal is understandable production-style code, not maximum
complexity.
