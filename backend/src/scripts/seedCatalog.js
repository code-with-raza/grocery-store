import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "../db/pool.js";

const { categories, products: storefrontProducts } = await import("../../../frontend/src/data/storefront.js");
const categoryNames = new Map(categories.map(({ id, name }) => [id, name]));
const products = storefrontProducts.map((product) => ({
  id: product.id, name: product.name, brand: product.brand,
  category: categoryNames.get(product.category),
  variants: product.variants.map(([size]) => size),
  base_price: product.variants[0]?.[1] ?? product.price,
  description: product.description, image_urls: [product.image],
}));
const legacyProductIds = ["dairy-001", "dairy-002", "dairy-003", "oil-001", "oil-002", "spice-001", "spice-002", "snack-001", "snack-002", "house-001"];

const schemaPath = fileURLToPath(new URL("../../sql/catalog.sql", import.meta.url));
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(await readFile(schemaPath, "utf8"));
  await client.query("DELETE FROM grocery_catalog.products WHERE id = ANY($1)", [legacyProductIds]);
  const categories = [...new Set(products.map(({ category }) => category))];
  for (const name of categories) {
    await client.query(
      `INSERT INTO grocery_catalog.categories (id, name) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`, [`catalog-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`, name],
    );
  }
  const result = await client.query("SELECT id, name FROM grocery_catalog.categories");
  const categoryIds = new Map(result.rows.map(({ id, name }) => [name, id]));
  for (const product of products) {
    await client.query(
      `INSERT INTO grocery_catalog.products
         (id, name, brand, category_id, variants, base_price, description, currency, image_urls)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'PKR',$8)
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, brand=EXCLUDED.brand,
         category_id=EXCLUDED.category_id, variants=EXCLUDED.variants,
         base_price=EXCLUDED.base_price, description=EXCLUDED.description,
         currency=EXCLUDED.currency, image_urls=EXCLUDED.image_urls, updated_at=NOW()`,
      [product.id, product.name, product.brand, categoryIds.get(product.category), product.variants,
        product.base_price, product.description, product.image_urls],
    );
  }
  await client.query("COMMIT");
  console.log(`Seeded ${categories.length} catalog categories and ${products.length} products.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
