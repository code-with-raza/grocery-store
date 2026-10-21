import { Router } from "express";
import { categories, products } from "../data/catalog.js";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/categories", (_request, response) => {
  response.json({ success: true, data: categories });
});

router.get("/products", (request, response) => {
  const { search = "", category = "all" } = request.query;
  const normalizedSearch = String(search).trim().toLowerCase();
  const result = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.brand}`.toLowerCase().includes(normalizedSearch);
    return matchesSearch && (category === "all" || product.category === category);
  });
  response.json({ success: true, data: result });
});

router.get("/blogs", async (_request, response, next) => {
  try { const rows = (await pool.query("SELECT id,title,slug,excerpt,content,image_url,status,created_at FROM blogs WHERE status='PUBLISHED' ORDER BY created_at DESC")).rows; response.json({ success: true, data: rows }); } catch (error) { next(error); }
});

export default router;
