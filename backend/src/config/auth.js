import jwt from "jsonwebtoken";

const issuer = "good-basket";

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET must be set to at least 32 characters");
  return value;
}

export function issueToken(payload) {
  return jwt.sign(payload, secret(), { expiresIn: "7d", issuer, audience: "good-basket-web" });
}

export function verifyToken(token) {
  return jwt.verify(token, secret(), { issuer, audience: "good-basket-web" });
}
