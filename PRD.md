# Grocery Superstore --- Product Requirements Document (PRD)

## 1. Product Overview

The product is a multi-city online grocery superstore for customers in
Pakistan.

The customer experience should resemble a single large superstore rather
than a marketplace: - One storefront - One cart - One checkout - One
delivery - Multiple product categories - Multiple suppliers/vendors may
exist behind the scenes

Suppliers/vendors and commission calculations are internal business
concepts and are not exposed to customers.

## 2. Product Goals

### Primary goals

1.  Allow customers across supported Pakistani cities to browse and
    purchase groceries online.
2.  Provide a simple, fast and trustworthy shopping experience.
3.  Support common Pakistani grocery products, brands, package sizes and
    variants.
4.  Provide COD and online payment options.
5.  Give administrators complete control over products, inventory,
    orders, customers, suppliers and promotions.
6.  Build a maintainable architecture suitable for an internship project
    and capable of future expansion.

### Non-goals for the MVP

-   Multi-vendor checkout visible to customers
-   Microservices
-   Real-time warehouse robotics/inventory systems
-   Native mobile applications
-   Complex recommendation/AI systems
-   International shipping
-   Full accounting/ERP functionality

## 3. Target Audience

Primary audience: - Customers in Pakistan - Initially focused on major
Pakistani cities - English-speaking users comfortable with online
shopping

The UI language is English. Urdu localization is not required for the
MVP.

## 4. Product Categories

The catalog should support:

1.  Atta, Flour & Grains
2.  Rice
3.  Daal & Pulses
4.  Cooking Oil & Ghee
5.  Sugar & Salt
6.  Spices & Masala
7.  Tea & Coffee
8.  Milk & Dairy
9.  Eggs
10. Bakery
11. Biscuits & Snacks
12. Beverages
13. Breakfast & Cereals
14. Canned & Packaged Foods
15. Frozen Foods
16. Fruits & Vegetables
17. Meat & Chicken
18. Personal Care
19. Household Cleaning
20. Baby Care
21. Pet Supplies

Categories should be manageable from the admin panel.

## 5. Real Brands

Products should support real Pakistani/international brands commonly
sold in Pakistan, for example: - National - Shan - Tapal - Lipton -
Nestlé - Olpers - Surf Excel - Pepsi - Coca-Cola

The admin should be able to create and manage brands rather than
hard-coding them.

## 6. Customer Features

### 6.1 Authentication

Customers can: - Register - Login - Logout - Maintain a profile

The MVP does not require social login.

### 6.2 Product browsing

Customers can: - Browse categories - Browse products - View product
details - View product images - Select product variants - See price -
See sale/discount price - See stock availability - See brand - See
package size - Add products to cart

### 6.3 Product variants

A single product may have multiple variants.

Example:

Rice: - 1 kg --- Rs. 400 - 5 kg --- Rs. 1,850 - 10 kg --- Rs. 3,500

Variants can have: - SKU - Weight/size label - Price - Sale price -
Stock quantity - Availability status - Optional barcode

### 6.4 Search and filters

Search should support product name, brand and relevant searchable
fields.

Filters: - Category - Brand - Price range - Availability - Product
attributes where applicable - Variant/weight

Sorting: - Relevance - Price low to high - Price high to low - Newest -
Popularity where data is available

### 6.5 Cart

Customer can: - Add products - Change quantity - Remove products - See
subtotal - See delivery fee - See discount - See final total

Cart must validate current product availability and price before
checkout.

### 6.6 Wishlist

Authenticated customers can: - Add products to wishlist - Remove
products - Move/add wishlist products to cart

### 6.7 Checkout

Checkout should collect: - Customer name - Phone number - Delivery
address - City - Area - Optional delivery instructions - Payment method

The checkout should clearly show: - Subtotal - Discount - Delivery fee -
Total

### 6.8 Payment methods

The product should be designed to support: - Cash on Delivery -
JazzCash - Easypaisa - Bank transfer - Debit/credit card

Payment provider integration can initially use a mock/sandbox
abstraction if live credentials are unavailable.

Payment logic should be isolated behind a payment service/interface so
providers can be integrated later without rewriting order logic.

### 6.9 Delivery

Default business rule:

**Free delivery above a configurable minimum order amount.**

Below the threshold, a configurable delivery fee is applied.

Example: - Order \>= Rs. 3,000 → Free delivery - Order \< Rs. 3,000 →
Rs. 200 delivery fee

The actual threshold and fee must be configurable by admin.

### 6.10 Frozen food delivery

Frozen products may have special delivery restrictions.

The product should support a product/category delivery flag such as: -
Standard - Frozen - Special handling

Customer-facing messaging should explain applicable restrictions before
checkout.

The system should be designed so frozen items can have rules such as: -
Limited delivery zones - Specific delivery windows - Additional handling
requirements

Do not implement unnecessarily complicated logistics in MVP.

### 6.11 Order tracking

Order statuses:

1.  Pending
2.  Confirmed
3.  Preparing
4.  Out for Delivery
5.  Delivered
6.  Cancelled

Customer can view the status and order timeline.

### 6.12 Order history

Customer can: - View previous orders - View order details - See
purchased products - See total - See payment method - See delivery
address - Reorder

Reorder should add currently available products/variants to the cart. It
should not blindly recreate an old order if products are unavailable or
prices have changed.

## 7. Admin Features

### 7.1 Dashboard

Admin dashboard should show: - Total orders - Revenue - Customers -
Products - Low-stock products - Pending orders - Recent orders -
Supplier/vendor summaries - Commission/revenue summaries

### 7.2 Product management

Admin can: - Create product - Edit product - Archive product - Manage
product images - Assign category - Assign brand - Create variants - Set
prices - Set sale prices - Manage stock - Mark special delivery
requirements

Products should preferably be archived rather than permanently deleted
when they have historical orders.

### 7.3 Category management

Admin can: - Create - Edit - Reorder - Activate/deactivate - Archive

### 7.4 Brand management

Admin can: - Create - Edit - Activate/deactivate

### 7.5 Inventory

Admin can: - View stock - Increase/decrease stock - Set stock quantity -
See low-stock items - See out-of-stock items

Inventory changes should be traceable where practical.

### 7.6 Order management

Admin can: - View orders - Search/filter orders - Open order details -
Update order status - Confirm payment - Handle cancellation - Review
customer details - Review delivery information

### 7.7 Customer management

Admin can: - View customers - Search customers - View customer order
history - Activate/deactivate customer accounts where required

### 7.8 Supplier/vendor management

Suppliers/vendors are internal.

Admin can: - Add supplier/vendor - Edit supplier/vendor -
Activate/deactivate supplier - Assign products to supplier - Configure
supplier commission

Default commission: **10%**

Commission is not visible to customers.

### 7.9 Discounts and coupons

Support: - Sale prices - Percentage discounts - Fixed amount discounts -
Coupon codes - Buy-one-get-one or bundle promotions as a future
extension

Coupons should support: - Code - Type - Value - Minimum order amount -
Start/end date - Usage limit - Active/inactive

### 7.10 Delivery configuration

Admin can configure: - Free-delivery threshold - Standard delivery fee -
Supported cities/areas - Frozen delivery restrictions - Delivery
availability

## 8. Business Rules

### Customer-facing marketplace rule

The customer sees the business as one superstore.

There is: - One cart - One checkout - One customer order - One delivery
calculation

Supplier/vendor details are internal.

### Commission rule

Default supplier commission: **10%**

Commission must not appear in: - Product pages - Cart - Checkout -
Customer order details - Customer invoices

It is for internal/admin reporting only.

### Price rule

The price displayed at checkout should be revalidated against the
current database value before creating the order.

### Stock rule

Stock must be checked before order creation.

On successful order placement, stock should be reserved/decremented
using a transaction-safe approach.

### Historical order rule

Order items must preserve the purchased: - Product name - Variant -
SKU - Unit price - Quantity - Discount

Historical orders must remain understandable even if a product is later
renamed or archived.

## 9. Non-functional Requirements

### Security

-   Passwords must be hashed.
-   Authentication tokens must be handled securely.
-   Authorization must distinguish customer/admin roles.
-   Validate all incoming request data.
-   Never trust price, discount or stock values from the frontend.
-   Use parameterized queries/ORM-safe database access.
-   Protect sensitive admin APIs.

### Performance

-   Pagination for large product/order lists
-   Database indexes for common searches
-   Avoid unnecessary API calls
-   Optimize product images
-   Lazy-load large product lists where appropriate

### Maintainability

-   Modular backend
-   Reusable React components
-   Clear naming
-   Consistent API response/error format
-   Environment variables for secrets/configuration
-   No unnecessary abstraction layers

## 10. MVP Success Criteria

A customer should be able to:

Register → browse products → search/filter → select variant → add to
wishlist/cart → checkout → choose payment → place order → track order →
view order history → reorder.

An admin should be able to:

Login → manage categories/brands/products/variants → manage inventory →
manage customers → manage orders → configure delivery → manage suppliers
→ view commission/revenue information.

## 11. Future Enhancements

Possible Phase 2 features: - Product reviews and ratings - Loyalty
points - Personalized recommendations - Push notifications -
SMS/WhatsApp notifications - Advanced supplier settlement - Delivery
rider dashboard - Real-time delivery tracking - Inventory forecasting -
Multi-warehouse inventory - Product bundles - Subscription/repeat
grocery orders - Urdu localization - Mobile application
