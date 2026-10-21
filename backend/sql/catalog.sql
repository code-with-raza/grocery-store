-- Isolated legacy catalog used by the product listing endpoint; this catalog uses text IDs and TEXT[] fields.
CREATE SCHEMA IF NOT EXISTS grocery_catalog;
CREATE TABLE IF NOT EXISTS grocery_catalog.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS grocery_catalog.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES grocery_catalog.categories(id),
  variants TEXT[] NOT NULL CHECK (cardinality(variants) > 0),
  base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
  description TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  image_urls TEXT[] NOT NULL CHECK (cardinality(image_urls) BETWEEN 2 AND 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS grocery_catalog_products_category_idx
  ON grocery_catalog.products(category_id);
