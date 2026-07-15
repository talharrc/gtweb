// Standalone, dependency-light serverless function — deliberately NOT part of
// api/index.ts's monolithic Express app (which bundles firebase, firebase-admin,
// @google/genai, etc.). Used to isolate whether that big function is the reason
// the real /api/auth/* endpoints hang in production, or whether the problem is
// elsewhere. No Firestore/Firebase/Google involved.

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const PASSCODE = "gtgonnarock";
const COOKIE_NAME = "gt_test_admin_session";

function getCookie(req: any, name: string): string | null {
  const raw: string = req.headers?.cookie ?? "";
  const match = raw.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export default function handler(req: any, res: any) {
  if (!JWT_SECRET) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "JWT_SECRET not configured." }));
    return;
  }

  if (req.method === "GET") {
    const raw = getCookie(req, COOKIE_NAME);
    if (!raw) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ authed: false }));
      return;
    }
    try {
      jwt.verify(raw, JWT_SECRET);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ authed: true }));
    } catch {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ authed: false }));
    }
    return;
  }

  if (req.method === "POST") {
    let body: any = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
    } catch {
      body = {};
    }

    if (body.logout) {
      res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (body.password !== PASSCODE) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Incorrect password." }));
      return;
    }

    const token = jwt.sign({ scope: "test-admin" }, JWT_SECRET, { expiresIn: "7d" });
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.statusCode = 405;
  res.end();
}
