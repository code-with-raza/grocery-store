# Grocery Superstore --- PostgreSQL Database Design

## 1. Database Principles

-   PostgreSQL is the source of truth.
-   Use UUIDs or generated IDs consistently.
-   Use foreign keys.
-   Add indexes for common query paths.
-   Use timestamps.
-   Preserve historical order data.
-   Avoid deleting records that are required for historical reporting.

## 2. Core Tables

### users

``` text
id
name
email
phone
password_hash
role
is_active
created_at
updated_at
```

Roles: - CUSTOMER - ADMIN

Indexes: - email - phone - role

### addresses

``` text
id
user_id
label
full_address
area
city
postal_code
delivery_instructions
is_default
created_at
updated_at
```

Relationship: - User 1 -\> many Addresses

## 3. Catalog

### categories

``` text
id
name
slug
description
image_url
is_active
sort_order
created_at
updated_at
```

### brands

``` text
id
name
slug
logo_url
is_active
created_at
updated_at
```

### suppliers

``` text
id
name
contact_name
email
phone
address
commission_rate
is_active
created_at
updated_at
```

Default commission rate: 10%.

### products

``` text
id
name
slug
description
category_id
brand_id
supplier_id
is_active
delivery_type
created_at
updated_at
```

delivery_type examples: - STANDARD - FROZEN - SPECIAL_HANDLING

### product_variants

``` text
id
product_id
sku
variant_name
weight_value
weight_unit
barcode
price
sale_price
stock_quantity
low_stock_threshold
is_active
created_at
updated_at
```

Examples:

``` text
Product: Basmati Rice

Variant:
1kg
SKU: RICE-NAT-1KG
Price: 400

Variant:
5kg
SKU: RICE-NAT-5KG
Price: 1850
```

A variant should be the inventory/price unit.

### product_images

``` text
id
product_id
image_url
alt_text
sort_order
created_at
```

## 4. Customer Shopping

### wishlists

``` text
id
user_id
created_at
```

### wishlist_items

``` text
id
wishlist_id
product_id
created_at
```

Unique constraint: wishlist_id + product_id

### carts

``` text
id
user_id
created_at
updated_at
```

### cart_items

``` text
id
cart_id
product_variant_id
quantity
created_at
updated_at
```

Unique constraint: cart_id + product_variant_id

## 5. Orders

### orders

``` text
id
order_number
user_id
address_id
status
payment_status
payment_method
subtotal
discount_amount
delivery_fee
total_amount
coupon_code
notes
created_at
updated_at
```

Order statuses: - PENDING - CONFIRMED - PREPARING - OUT_FOR_DELIVERY -
DELIVERED - CANCELLED

Payment statuses: - PENDING - PAID - FAILED - REFUNDED - COD_PENDING

### order_items

``` text
id
order_id
product_variant_id
supplier_id
product_name_snapshot
variant_name_snapshot
sku_snapshot
unit_price
quantity
discount_amount
line_total
created_at
```

Snapshot fields are important.

If a product changes later, old orders should still display the product
details that were purchased.

### order_status_history

``` text
id
order_id
status
note
created_at
```

Used for customer/admin order timelines.

## 6. Payments

### payments

``` text
id
order_id
method
provider
transaction_reference
amount
status
paid_at
created_at
updated_at
```

Do not store raw card numbers or sensitive payment credentials.

## 7. Promotions

### coupons

``` text
id
code
discount_type
discount_value
minimum_order_amount
maximum_discount
usage_limit
used_count
starts_at
expires_at
is_active
created_at
updated_at
```

discount_type: - PERCENTAGE - FIXED

### coupon_usages

``` text
id
coupon_id
user_id
order_id
created_at
```

## 8. Inventory

### inventory_transactions

``` text
id
product_variant_id
type
quantity
reference_type
reference_id
note
created_at
```

Types: - STOCK_IN - STOCK_OUT - ADJUSTMENT - ORDER_RESERVED -
ORDER_RELEASED - RETURN

This gives the admin an audit trail.

## 9. Delivery

### delivery_zones

``` text
id
city
area
delivery_fee
free_delivery_threshold
is_active
created_at
updated_at
```

If the business uses one global threshold, the same concept can be
configured globally instead.

### delivery_rules

``` text
id
name
delivery_type
description
is_active
created_at
updated_at
```

The MVP can keep frozen-food restrictions simple.

## 10. Relationships

``` text
users
  |
  +---- addresses
  |
  +---- wishlist ---- wishlist_items ---- products
  |
  +---- cart -------- cart_items -------- product_variants
  |
  +---- orders ------ order_items ------- product_variants
                     |
                     +------------------- suppliers

categories -------- products -------- brands
                         |
                         +---- product_variants
                         |
                         +---- product_images
                         |
                         +---- suppliers

orders ---- payments
orders ---- order_status_history
orders ---- coupon_usages ---- coupons

product_variants ---- inventory_transactions
```

## 11. Important Indexes

Recommended indexes:

``` text
users(email)
users(phone)

categories(slug)
brands(slug)
products(slug)
products(category_id)
products(brand_id)
products(supplier_id)

product_variants(sku)
product_variants(product_id)
product_variants(stock_quantity)

orders(order_number)
orders(user_id)
orders(status)
orders(created_at)

order_items(order_id)

wishlist_items(wishlist_id)
cart_items(cart_id)

coupons(code)
```

Use unique indexes where appropriate.

## 12. Transaction Requirements

Order creation should use a database transaction.

Conceptually:

``` text
BEGIN

1. Lock/check relevant inventory
2. Validate stock
3. Read current prices
4. Validate coupon
5. Calculate totals
6. Create order
7. Create order items
8. Update stock
9. Create payment record
10. Create order status history

COMMIT
```

If any critical step fails:

``` text
ROLLBACK
```

This prevents situations such as an order being created while stock is
not updated.

## 13. Historical Data

Never depend only on the current product table to display old orders.

Store snapshots in order_items: - Product name - Variant name - SKU -
Unit price

This protects historical order integrity.
