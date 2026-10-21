# AI Coding Agent --- Grocery Superstore Implementation Prompt

## Role

You are a senior full-stack engineer helping implement a
production-style internship project.

Build the Grocery Superstore according to the attached project
documentation:

-   PRD.md
-   ARCHITECTURE.md
-   DATABASE.md
-   TECH_STACK.md

The technology stack is:

-   React
-   Tailwind CSS
-   Node.js
-   Express.js
-   PostgreSQL

## Critical instructions

1.  Do not invent requirements that conflict with the PRD.
2.  Do not replace the specified stack without a strong technical
    reason.
3.  Do not introduce microservices.
4.  Do not add unnecessary Docker/Kubernetes/Kafka/Redis infrastructure.
5.  Keep the architecture modular but understandable.
6.  Write conventional, maintainable code.
7.  Avoid excessive abstraction.
8.  Do not generate huge files containing unrelated responsibilities.
9.  Use meaningful variable/function/component names.
10. Do not put business logic directly into React page components when
    it belongs in services.
11. Do not trust frontend prices, discounts or stock values.
12. Validate important data on the backend.
13. Use PostgreSQL transactions for order creation and inventory
    changes.
14. Preserve historical order information using order-item snapshots.
15. Never expose supplier commission information to customers.

## Product model

The application is a grocery superstore for Pakistan.

The customer should experience:

``` text
One store
One cart
One checkout
One order
One delivery
```

Suppliers/vendors exist behind the scenes.

The customer must NOT see: - Supplier names unless explicitly required
by a future feature - Supplier commission - Internal settlement
calculations

Default supplier commission is 10%.

## Customer functionality

Implement:

-   Registration/login/logout
-   Product browsing
-   Categories
-   Brands
-   Product variants
-   Search
-   Filters
-   Cart
-   Wishlist
-   Checkout
-   Multiple payment method choices
-   Delivery calculation
-   Frozen-food information/restrictions
-   Order placement
-   Order tracking
-   Order history
-   Reorder

## Admin functionality

Implement:

-   Dashboard
-   Product management
-   Category management
-   Brand management
-   Product variants
-   Inventory management
-   Customer management
-   Order management
-   Supplier management
-   Supplier commission configuration
-   Coupon management
-   Delivery configuration

## Payment functionality

Support the application-level choices:

-   Cash on Delivery
-   JazzCash
-   Easypaisa
-   Bank Transfer
-   Card

If real provider credentials are unavailable, create a clean payment
abstraction and sandbox/mock implementations.

Do not pretend a fake payment is a real payment.

## Delivery

Implement configurable:

-   Free-delivery threshold
-   Standard delivery fee
-   Supported cities/areas

Frozen products should be clearly marked and should have a simple rule
system for special handling/restrictions.

Do not build advanced logistics optimization.

## UI requirements

The frontend must look like a professional grocery e-commerce website.

Use: - Responsive design - Clear typography - Consistent spacing -
Product cards - Category navigation - Search - Cart indicator -
Professional checkout - Professional admin dashboard - Empty states -
Loading states - Error states - Confirmation states

Language: English only.

Do not add Urdu UI unless explicitly requested.

## Coding style

Write code that an experienced developer can understand quickly.

Prefer:

``` text
productService
orderService
inventoryService
paymentService
deliveryService
```

over giant generic utility systems.

Controllers should be thin.

Bad:

``` text
controller contains:
- database queries
- stock calculation
- coupon calculation
- payment logic
- email logic
- response formatting
```

Better:

``` text
controller
   |
   v
orderService
   |
   +-- inventoryService
   +-- couponService
   +-- deliveryService
   +-- paymentService
```

## Database rules

Use PostgreSQL.

Important entities include:

-   users
-   addresses
-   categories
-   brands
-   suppliers
-   products
-   product_variants
-   product_images
-   carts
-   cart_items
-   wishlists
-   wishlist_items
-   orders
-   order_items
-   order_status_history
-   payments
-   coupons
-   coupon_usages
-   inventory_transactions
-   delivery_zones
-   delivery_rules

Use proper: - Foreign keys - Unique constraints - Indexes - Timestamps

## Order transaction

Order creation must be transaction-safe.

Conceptually:

``` text
BEGIN
  validate customer
  validate address
  load current products
  validate stock
  validate coupon
  calculate subtotal
  calculate discount
  calculate delivery
  calculate total
  create order
  create order items
  update inventory
  create payment
  create order status history
COMMIT
```

Rollback if a critical operation fails.

## API rules

Use:

``` text
/api/v1/...
```

Keep API responses consistent.

Success:

``` json
{
  "success": true,
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "message": "Product is out of stock",
  "code": "OUT_OF_STOCK"
}
```

Do not expose stack traces to clients.

## Authentication and authorization

Implement: - Customer role - Admin role

Protected customer routes must require authentication.

Admin routes must require authentication + admin authorization.

Never trust:

``` text
userId
role
price
discount
stock
```

when these values are supplied by the client.

## Product pricing

The frontend may display prices, but the backend is authoritative.

At checkout: - Reload current product/variant prices - Validate
availability - Calculate totals on the server

## Inventory

Inventory belongs to product variants.

Example:

``` text
Rice
  1kg -> 100 units
  5kg -> 50 units
  10kg -> 20 units
```

Track inventory changes.

Do not simply decrement stock without considering transaction safety.

## Reorder

When a customer selects reorder: - Find the old order - Check each
current product variant - Check current availability - Use current
prices - Add available items to the cart - Inform the customer about
unavailable items

Do not recreate the historical order blindly.

## Error handling

Implement centralized Express error handling.

Handle: - Validation errors - Authentication errors - Authorization
errors - Not found - Conflict - Database errors - Business rule errors

## Project development process

Do NOT attempt to generate the whole application blindly in one step.

Build in phases.

### Phase 1 --- Project setup

Create: - Frontend - Backend - PostgreSQL configuration - Environment
configuration - ESLint/Prettier - Basic folder structure

Verify both applications run.

### Phase 2 --- Database

Implement: - Prisma/ORM schema - Migrations - Seed data - Categories -
Brands - Suppliers - Products - Variants

Seed realistic grocery products and Pakistani brands.

Verify database relationships.

### Phase 3 --- Authentication

Implement: - Registration - Login - Logout - Password hashing - JWT -
Protected routes - Admin authorization

Test authentication before continuing.

### Phase 4 --- Catalog

Implement: - Product listing - Product details - Categories - Brands -
Search - Filters - Variants - Stock visibility

### Phase 5 --- Cart and wishlist

Implement: - Add/remove cart items - Quantity updates - Cart totals -
Wishlist - Move wishlist item to cart

### Phase 6 --- Checkout and delivery

Implement: - Address - Delivery zones - Free delivery threshold -
Delivery fee - Frozen product warnings - Server-side total calculation

### Phase 7 --- Orders and payments

Implement: - Order creation - Transaction-safe inventory update -
Payment record - COD - Mock/sandbox online payment providers - Order
status history - Customer order tracking

### Phase 8 --- Customer account

Implement: - Profile - Order history - Order details - Reorder -
Wishlist

### Phase 9 --- Admin

Implement: - Dashboard - Products - Categories - Brands - Variants -
Inventory - Orders - Customers - Suppliers - Coupons - Delivery
configuration

### Phase 10 --- Polish

Implement: - Responsive UI - Loading states - Empty states - Error
states - Form validation - Accessibility basics - API error handling -
Security review - Performance review

## Testing after every phase

After each phase: 1. Run the application. 2. Run linting. 3. Run
relevant tests. 4. Test the primary user flow. 5. Fix errors before
moving forward.

Do not continue building on top of known broken functionality.

## Seed data

Create realistic demo data.

Example categories: - Rice - Daal & Pulses - Cooking Oil & Ghee - Tea &
Coffee - Milk & Dairy - Biscuits & Snacks - Beverages - Frozen Foods -
Fruits & Vegetables - Personal Care - Household Cleaning

Example brands: - National - Shan - Tapal - Nestlé - Olpers - Surf
Excel - Pepsi - Coca-Cola

Use realistic PKR prices but clearly treat seed data as demo data.

## Security requirements

At minimum: - Password hashing - JWT validation - Role authorization -
Request validation - CORS configuration - Helmet/security headers - Rate
limiting on sensitive endpoints - Parameterized/ORM-safe database
queries - Secure environment variables

Never: - hard-code secrets - store plaintext passwords - trust frontend
totals - trust frontend roles - return internal stack traces

## What NOT to do

Do not: - create microservices - add unnecessary state management -
create dozens of generic abstractions - create a massive single
component - create a massive single controller - put database queries
everywhere - hard-code business rules into frontend components - store
secrets in source code - fake production payment integrations - claim
features are complete without testing them

## Final quality bar

The finished project should demonstrate that the developer understands:

-   React component architecture
-   REST API design
-   Express middleware
-   Authentication/authorization
-   PostgreSQL relational modeling
-   Transactions
-   Inventory management
-   E-commerce order flow
-   Server-side validation
-   Role-based admin systems
-   Clean code organization
-   Basic production security

The goal is a credible, maintainable internship-level full-stack
project, not an over-engineered enterprise system.
