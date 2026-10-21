ALTER TABLE grocery_catalog.products
  ADD COLUMN IF NOT EXISTS discount_price NUMERIC(12, 2) CHECK (discount_price IS NULL OR discount_price >= 0);
