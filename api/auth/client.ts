// Standalone, dependency-light serverless function for client login — same
// pattern as api/auth/admin.ts, deliberately NOT part of api/index.ts's
// monolithic Express app (found unresponsive in production). Only dependency
// is jsonwebtoken. No Firestore/Firebase/Google involved.
//
// The "pass" is a signed invite JWT (minted by /api/admin/generate-passes),
// carrying role/email/projectId/projectName. This handler just verifies it
// and re-signs a real gt_session cookie — no persistent storage needed.

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
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

  const pass = typeof body.pass === "string" ? body.pass.trim() : "";
  if (!pass) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Pass is required." }));
    return;
  }

  let payload: any;
  try {
    payload = jwt.verify(pass, JWT_SECRET);
  } catch {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid or expired pass." }));
    return;
  }

  if (payload?.type !== "invite" || payload?.role !== "client") {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "This pass is not valid for client access." }));
    return;
  }

  const token = jwt.sign(
    { role: "client", email: payload.email, projectId: payload.projectId ?? null, projectName: payload.projectName ?? null },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `gt_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true, email: payload.email, projectId: payload.projectId ?? null, projectName: payload.projectName ?? null }));
}
