ALTER TABLE grocery_catalog.categories
  ADD COLUMN IF NOT EXISTS meta_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_description TEXT NOT NULL DEFAULT '';
