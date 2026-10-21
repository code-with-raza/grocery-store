# Grocery Superstore --- System Architecture

## 1. Architecture Style

Use a modular monolithic architecture for the MVP.

Do NOT start with microservices.

``` text
React + Tailwind
       |
       | HTTPS / REST API
       v
Node.js + Express
       |
       +-------------------------------+
       |                               |
       v                               v
  Business Modules                 PostgreSQL
       |
       +-- Auth
       +-- Users
       +-- Products
       +-- Categories
       +-- Brands
       +-- Cart
       +-- Wishlist
       +-- Orders
       +-- Payments
       +-- Inventory
       +-- Coupons
       +-- Delivery
       +-- Suppliers
       +-- Admin
```

The architecture should allow individual modules to evolve later without
requiring an immediate microservice migration.

## 2. Frontend Architecture

Recommended structure:

``` text
src/
├── app/
├── components/
│   ├── common/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   └── admin/
├── pages/
│   ├── public/
│   ├── customer/
│   └── admin/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── wishlist/
│   ├── orders/
│   └── admin/
├── services/
│   └── api/
├── hooks/
├── context/
├── utils/
├── types/
└── assets/
```

Use React components for presentation and feature modules for
domain-specific logic.

Avoid putting large amounts of business logic directly inside page
components.

## 3. Frontend Responsibilities

React is responsible for: - Rendering UI - Form handling - Client-side
validation for UX - API communication - Authentication state - Cart
state - Wishlist state - Loading/error states - Responsive design

The frontend must NOT be trusted for: - Final prices - Discounts - Stock
availability - Commission calculations - Order totals

Those must be validated by the backend.

## 4. Backend Architecture

Recommended structure:

``` text
src/
├── config/
├── controllers/
├── routes/
├── services/
├── repositories/
├── middleware/
├── validators/
├── models/
├── utils/
├── types/
└── app.js
```

### Layer responsibilities

#### Routes

Define HTTP endpoints and connect them to controllers.

#### Controllers

Receive HTTP requests, validate the request shape through middleware,
call services, and return responses.

Controllers should remain thin.

#### Services

Contain business logic.

Examples: - Calculate order total - Validate stock - Apply coupon -
Calculate delivery fee - Create order - Calculate supplier commission

#### Repositories

Handle database access.

This layer is optional for extremely simple operations, but should be
used consistently if the project adopts it.

#### Middleware

Examples: - Authentication - Authorization - Request validation - Error
handling - Logging - Rate limiting where appropriate

## 5. API Architecture

Use REST APIs.

Example:

``` text
/api/v1/auth
/api/v1/products
/api/v1/categories
/api/v1/brands
/api/v1/cart
/api/v1/wishlist
/api/v1/orders
/api/v1/payments
/api/v1/coupons
/api/v1/delivery
/api/v1/admin
/api/v1/suppliers
```

Versioning should be introduced from the beginning:

``` text
/api/v1/...
```

## 6. Authentication

Recommended model: - JWT-based authentication - Password hashing using
bcrypt or Argon2 - Role-based authorization

Roles:

``` text
CUSTOMER
ADMIN
```

Supplier/vendor access can be introduced later if a supplier portal is
required.

The backend must always determine the authenticated user from the
authentication mechanism rather than trusting a user ID sent by the
frontend.

## 7. Order Architecture

The customer creates one order.

Internally, the order can reference multiple suppliers through order
items.

``` text
Order
 |
 +-- OrderItem -> ProductVariant -> Supplier A
 |
 +-- OrderItem -> ProductVariant -> Supplier B
 |
 +-- OrderItem -> ProductVariant -> Supplier A
```

The customer still pays one final total and receives one customer-facing
order.

This avoids exposing supplier complexity to the customer.

## 8. Order Creation Flow

``` text
Customer clicks Place Order
          |
          v
Authenticate customer
          |
          v
Validate delivery address
          |
          v
Load current product/variant prices
          |
          v
Check stock
          |
          v
Validate coupon
          |
          v
Calculate subtotal
          |
          v
Calculate discount
          |
          v
Calculate delivery fee
          |
          v
Calculate final total
          |
          v
Create order + order items
          |
          v
Update/reserve inventory
          |
          v
Create payment record
          |
          v
Return order confirmation
```

Order creation and inventory changes should be transaction-safe.

## 9. Inventory Architecture

Inventory belongs to product variants rather than only products.

Example:

``` text
National Basmati Rice
├── 1kg variant  -> stock 100
├── 5kg variant  -> stock 50
└── 10kg variant -> stock 20
```

This prevents incorrect stock tracking across different package sizes.

## 10. Delivery Architecture

Delivery rules should be configurable.

``` text
Order subtotal
     |
     +-- >= free delivery threshold --> FREE
     |
     +-- < threshold -----------------> standard fee
```

Product/category delivery metadata can identify frozen/special-handling
products.

Do not create a complex route optimization engine for MVP.

## 11. Payment Architecture

Create a payment abstraction:

``` text
PaymentService
├── CashOnDelivery
├── JazzCash
├── Easypaisa
├── BankTransfer
└── CardPayment
```

For the MVP, unavailable live providers may use a mock/sandbox
implementation.

The order service should not contain provider-specific code.

## 12. Supplier Architecture

Supplier/vendor data is internal.

``` text
Supplier
├── name
├── contact
├── status
└── commissionRate
```

Products/variants can reference suppliers.

Default commission: 10%.

Commission calculation belongs to backend business logic and admin
reporting.

## 13. Error Handling

Use one centralized Express error handler.

API errors should follow a consistent structure:

``` json
{
  "success": false,
  "message": "Product is out of stock",
  "code": "OUT_OF_STOCK"
}
```

Success example:

``` json
{
  "success": true,
  "data": {}
}
```

Do not leak stack traces or internal database errors to production
clients.

## 14. Logging

Use structured application logging.

Log useful operational information: - Request errors - Authentication
failures - Order failures - Payment failures - Inventory errors

Never log: - Passwords - Payment credentials - JWT secrets - Sensitive
customer data unnecessarily

## 15. Security Architecture

Important protections: - Input validation - Authentication middleware -
Role-based authorization - Secure password hashing - HTTP security
headers - CORS configuration - Rate limiting for sensitive endpoints -
Parameterized/ORM-safe queries - Environment variables - Secure
cookie/token strategy - File upload validation if images are uploaded

## 16. Deployment Architecture

Initial production architecture can be:

``` text
Browser
   |
   v
Frontend Hosting
   |
   v
Express API Server
   |
   v
Managed PostgreSQL
```

Image storage can later use object storage such as S3-compatible storage
or a managed image service.

Do not require Docker for the MVP unless the development/deployment
environment specifically benefits from it.

## 17. Scalability Strategy

Do not prematurely introduce: - Microservices - Kafka - Redis
everywhere - Kubernetes - Event-driven architecture

Instead, prepare for scale through: - Good database indexes -
Pagination - Clean modules - Stateless API design - Proper
transactions - Efficient queries - Image optimization

These provide much more value at the current project stage.
