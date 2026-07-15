// Standalone, dependency-light serverless function for admin login — deliberately
// NOT part of api/index.ts's monolithic Express app (which was found to be
// unresponsive in production). Only dependency is jsonwebtoken. No Firestore/
// Firebase/Google involved. Cookie name/shape matches api/index.ts's gt_session
// exactly so /hub/* routes and requireAdmin-gated endpoints keep working.

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.VITE_ADMIN_EMAIL ?? "mail.galaxatech@gmail.com";
const PASSCODE = "gtgonnarock";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  if (!JWT_SECRET) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "JWT_SECRET not configured." }));
    return;
  }

  let body: any = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  } catch {
    body = {};
  }

  if (!body.password) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Password is required." }));
    return;
  }

  if (body.password !== PASSCODE) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Incorrect password." }));
    return;
  }

  const token = jwt.sign({ role: "admin", email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: "7d" });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `gt_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true }));
}
