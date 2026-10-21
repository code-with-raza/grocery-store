import { verifyToken } from "../config/auth.js";

export function requireAuth(request, response, next) {
  const token = request.cookies?.session || request.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ success: false, message: "Please sign in", code: "UNAUTHENTICATED" });
  try {
    request.user = verifyToken(token);
    return next();
  } catch {
    return response.status(401).json({ success: false, message: "Your session has expired", code: "INVALID_SESSION" });
  }
}

export function requireAdmin(request, response, next) {
  if (request.user?.role !== "ADMIN") return response.status(403).json({ success: false, message: "Admin access required", code: "FORBIDDEN" });
  return next();
}
