import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import catalogRoutes from "./routes/catalog.js";
import authRoutes from "./routes/auth.js";
import productCatalogRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import customerRoutes from "./routes/customer.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());
app.use("/api/v1", rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/api/v1/health", (_request, response) => {
  response.json({ success: true, data: { status: "ok", service: "grocery-superstore-api" } });
});
app.use("/api/products", productCatalogRoutes);
app.use("/api/v1", catalogRoutes);
app.use("/api/v1/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }), authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use((_request, response) => {
  response.status(404).json({ success: false, message: "Route not found", code: "NOT_FOUND" });
});
app.use((error, _request, response, _next) => {
  console.error(error);
  if (error?.code === "EMAIL_NOT_CONFIGURED") return response.status(503).json({ success: false, message: "Email service is not configured", code: error.code });
  if (error?.code === "EMAIL_DELIVERY_FAILED") return response.status(502).json({ success: false, message: error.message, code: error.code });
  if (error?.code === "23505") return response.status(409).json({ success: false, message: "That value already exists", code: "CONFLICT" });
    if (["28P01", "3D000", "42P01", "ECONNREFUSED"].includes(error?.code) || /DATABASE_URL|database credentials|connection refused|empty host/i.test(error?.message || "")) {
    return response.status(503).json({ success: false, message: "Database service is unavailable. Check DATABASE_URL and PostgreSQL.", code: "DATABASE_UNAVAILABLE" });
  }
  response.status(500).json({ success: false, message: "Something went wrong", code: "INTERNAL_ERROR" });
});

export default app;
