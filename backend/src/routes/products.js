import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();
router.get("/", async (request, response, next) => {
  try {
    const limit = Math.min(Math.max(Number(request.query.limit) || 100, 1), 500);
    const offset = Math.max(Number(request.query.offset) || 0, 0);
    const search = String(request.query.search || "").trim();
    const { rows } = await pool.query(
      `SELECT p.id, p.name, p.brand, p.variants, p.base_price, p.discount_price, p.description,
              p.currency, p.image_urls, c.name AS category
       FROM grocery_catalog.products AS p
       INNER JOIN grocery_catalog.categories AS c ON c.id = p.category_id
       WHERE p.status = 'PUBLISHED' AND ($1 = '' OR p.name ILIKE '%' || $1 || '%' OR p.brand ILIKE '%' || $1 || '%' OR c.name ILIKE '%' || $1 || '%')
       ORDER BY c.name, p.name LIMIT $2 OFFSET $3`, [search, limit, offset],
    );
    response.json({ products: rows, pagination: { limit, offset, count: rows.length } });
  } catch (error) { next(error); }
});
export default router;
