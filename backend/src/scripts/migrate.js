import "dotenv/config";
import { readFile } from "node:fs/promises";
import { pool } from "../db/pool.js";

try {
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  const migration = await pool.query("SELECT version FROM schema_migrations WHERE version IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", ["001_initial_schema", "002_admin_blogs", "003_production_features", "004_catalog_admin", "005_remove_demo_blogs", "006_product_editor", "007_product_discounts", "008_product_images", "009_product_status", "010_category_seo"]);
  const versions = new Set(migration.rows.map(({ version }) => version));
  if (!versions.has("001_initial_schema")) {
    const existing = await pool.query("SELECT to_regclass('public.users') AS table_name");
    if (!existing.rows[0].table_name) await pool.query(await readFile(new URL("../../sql/app.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["001_initial_schema"]);
  }
  if (!versions.has("002_admin_blogs")) {
    await pool.query(await readFile(new URL("../../sql/admin.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["002_admin_blogs"]);
    console.log("Admin blog schema applied.");
  }
  if (!versions.has("003_production_features")) {
    await pool.query(await readFile(new URL("../../sql/production.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["003_production_features"]);
    console.log("Production feature schema applied.");
  } else if (versions.has("002_admin_blogs")) {
    console.log("PostgreSQL schema is up to date.");
  }
  if (!versions.has("004_catalog_admin")) {
    await pool.query(await readFile(new URL("../../sql/catalog-admin.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["004_catalog_admin"]);
    console.log("Catalog admin schema applied.");
  }
  if (!versions.has("005_remove_demo_blogs")) {
    await pool.query("DELETE FROM blogs WHERE slug = ANY($1::text[])", [[
      "easy-pantry-meals-for-busy-evenings",
      "smarter-weekly-grocery-shop",
      "keep-produce-fresh-longer",
      "budget-meals-from-everyday-staples",
    ]]);
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["005_remove_demo_blogs"]);
    console.log("Seeded demo blogs removed.");
  }
  if (!versions.has("006_product_editor")) {
    await pool.query(await readFile(new URL("../../sql/product-editor.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["006_product_editor"]);
    console.log("Product editor schema applied.");
  }
  if (!versions.has("007_product_discounts")) {
    await pool.query(await readFile(new URL("../../sql/product-discounts.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["007_product_discounts"]);
    console.log("Product discount schema applied.");
  }
  if (!versions.has("008_product_images")) {
    await pool.query(await readFile(new URL("../../sql/product-images.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["008_product_images"]);
    console.log("Product image schema applied.");
  }
  if (!versions.has("009_product_status")) {
    await pool.query(await readFile(new URL("../../sql/product-status.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["009_product_status"]);
    console.log("Product status schema applied.");
  }
  if (!versions.has("010_category_seo")) {
    await pool.query(await readFile(new URL("../../sql/category-seo.sql", import.meta.url), "utf8"));
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", ["010_category_seo"]);
    console.log("Category SEO schema applied.");
  }
} finally {
  await pool.end();
}
