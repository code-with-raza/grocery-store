ALTER TABLE grocery_catalog.products DROP CONSTRAINT IF EXISTS products_image_urls_check;
ALTER TABLE grocery_catalog.products ADD CONSTRAINT products_image_urls_check CHECK (cardinality(image_urls) BETWEEN 0 AND 10);
