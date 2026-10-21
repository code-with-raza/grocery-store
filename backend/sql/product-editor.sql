ALTER TABLE grocery_catalog.products
  ADD COLUMN IF NOT EXISTS meta_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_description TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0);
