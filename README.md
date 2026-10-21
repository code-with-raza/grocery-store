# Good Basket grocery superstore

Good Basket is a Pakistan-focused grocery storefront built with React, Vite, Tailwind CSS and an Express API. The repository includes the customer shopping UI, all 21 PRD categories, demo product cards with product descriptions and pack-size variants, account screens, cart and checkout screens, order history screens, and an admin dashboard preview.

## Application layout

- `frontend/` — responsive customer and admin-preview interfaces.
- `backend/` — versioned Express API, catalog demo data, and PostgreSQL Prisma schema.
- `backend/prisma/schema.prisma` — relational model for users, catalog, carts, wishlists, orders, payments, inventory, coupons and delivery configuration.
- `PRD.md`, `ARCHITECTURE.md`, `DATABASE.md`, `TECH_STACK.md` — original requirements.

## Local development

Install dependencies separately in `frontend/` and `backend/`, copy each `.env.example` to `.env`, configure PostgreSQL, then run:

```sh
# backend
npm run db:generate
npm run db:migrate
npm run dev

# frontend (another terminal)
npm run dev
```

Frontend address: `http://localhost:5173`. API address: `http://localhost:4000/api/v1`.

Set `DATABASE_URL`, a long random `JWT_SECRET`, and `FRONTEND_URL` in the backend environment. Public registration always creates a customer account; create admin accounts through a controlled database/seed process, never by using a client supplied role.

The requested storefront catalog is isolated in the PostgreSQL `grocery_catalog` schema so its text product IDs and `TEXT[]` fields do not conflict with the existing Prisma checkout tables. After configuring a working `DATABASE_URL`, seed its five categories and ten products with:

```sh
cd backend
npm run db:seed:catalog
```

The seed creates the schema and tables, and can be rerun safely. The React storefront loads this catalog from `GET /api/products` when it is available; otherwise it keeps the local preview catalog. Set `VITE_CATALOG_API_URL` in `frontend/.env` if the API runs at a different origin.

## Current implementation boundary

The account forms call the API's PostgreSQL-backed registration/login endpoints and use an HTTP-only JWT cookie. Basket and order placement/history are still browser demo flows; checkout does not yet create a server order or reserve inventory. The admin dashboard is a UI preview and does not yet perform live catalog/order management. Online payment providers and delivery-zone integrations are not configured. Do not deploy this as a live store until those flows are backed by the database, payment and delivery services and have been verified in the target environment.
