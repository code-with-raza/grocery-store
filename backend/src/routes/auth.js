import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { issueToken } from "../config/auth.js";

const router = Router();
const registration = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), password: z.string().min(8).max(100).refine(value => /[a-z]/.test(value) && /[A-Z]/.test(value) && /[^A-Za-z0-9]/.test(value)) });
const login = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(100) });
const publicUser = ({ id, name, email, role }) => ({ id, name, email, role });
const sessionCookie = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60 * 1000 };
const issueSession = (response, user) => response.cookie("session", issueToken({ sub: user.id, role: user.role }), sessionCookie);

router.post("/register", async (request, response, next) => {
  try {
    const parsed = registration.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ success: false, message: "Use 8+ characters with uppercase, lowercase and a special character", code: "VALIDATION_ERROR" });
    const email = parsed.data.email.toLowerCase();
    if ((await pool.query("SELECT id FROM users WHERE email=$1", [email])).rowCount) return response.status(409).json({ success: false, message: "An account with this email already exists", code: "EMAIL_EXISTS" });
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = (await pool.query("INSERT INTO users (id,name,email,password_hash,role,is_active,email_verified,auth_provider,created_at,updated_at) VALUES ($1,$2,$3,$4,'CUSTOMER',true,true,'LOCAL',NOW(),NOW()) RETURNING id,name,email,role", [randomUUID(), parsed.data.name, email, passwordHash])).rows[0];
    issueSession(response, user);
    return response.status(201).json({ success: true, data: { user } });
  } catch (error) { return next(error); }
});

router.post("/google", async (request, response, next) => {
  try {
    const parsed = z.object({ credential: z.string().min(20) }).safeParse(request.body);
    if (!parsed.success || !process.env.GOOGLE_CLIENT_ID) return response.status(400).json({ success: false, message: "Google sign-in is not configured", code: "GOOGLE_AUTH_UNAVAILABLE" });
    const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(parsed.data.credential)}`);
    const profile = await googleResponse.json();
    if (!googleResponse.ok || profile.aud !== process.env.GOOGLE_CLIENT_ID || profile.email_verified !== "true") return response.status(401).json({ success: false, message: "Google authentication failed", code: "INVALID_GOOGLE_TOKEN" });
    const email = profile.email.toLowerCase();
    let user = (await pool.query("SELECT id,name,email,role FROM users WHERE google_sub=$1 OR email=$2 LIMIT 1", [profile.sub, email])).rows[0];
    if (user) user = (await pool.query("UPDATE users SET google_sub=$1,email_verified=true,auth_provider='GOOGLE',updated_at=NOW() WHERE id=$2 RETURNING id,name,email,role", [profile.sub, user.id])).rows[0];
    else user = (await pool.query("INSERT INTO users (id,name,email,password_hash,role,is_active,email_verified,auth_provider,google_sub,created_at,updated_at) VALUES ($1,$2,$3,$4,'CUSTOMER',true,true,'GOOGLE',$5,NOW(),NOW()) RETURNING id,name,email,role", [randomUUID(), profile.name || email.split("@")[0], email, await bcrypt.hash(randomUUID(), 12), profile.sub])).rows[0];
    issueSession(response, user);
    return response.json({ success: true, data: { user } });
  } catch (error) { return next(error); }
});

router.post("/login", async (request, response, next) => {
  try {
    const parsed = login.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ success: false, message: "Enter a valid email and password", code: "VALIDATION_ERROR" });
    const user = (await pool.query("SELECT id,name,email,role,is_active,password_hash,auth_provider FROM users WHERE email=$1 LIMIT 1", [parsed.data.email.toLowerCase()])).rows[0];
    if (!user || !user.is_active || user.auth_provider === "GOOGLE" || !(await bcrypt.compare(parsed.data.password, user.password_hash))) return response.status(401).json({ success: false, message: user?.auth_provider === "GOOGLE" ? "Use Google to sign in" : "Email or password is incorrect", code: "INVALID_CREDENTIALS" });
    issueSession(response, user);
    return response.json({ success: true, data: { user: publicUser(user) } });
  } catch (error) { return next(error); }
});

router.post("/logout", (_request, response) => { response.clearCookie("session", { ...sessionCookie, maxAge: undefined }); response.json({ success: true, data: { loggedOut: true } }); });
router.get("/me", requireAuth, async (request, response, next) => { try { const user = (await pool.query("SELECT id,name,email,role,is_active FROM users WHERE id=$1", [request.user.sub])).rows[0]; if (!user?.is_active) return response.status(401).json({ success: false, message: "Account is unavailable", code: "ACCOUNT_DISABLED" }); return response.json({ success: true, data: { user: publicUser(user) } }); } catch (error) { return next(error); } });

export default router;
