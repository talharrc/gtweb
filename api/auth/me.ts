// Standalone, dependency-light serverless function — session check for ALL
// roles (admin/client/builder/customer), moved out of api/index.ts's
// monolithic Express app (found unresponsive in production). Pure JWT verify,
// same as the original handler; no Firestore/Firebase/Google involved.

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function getCookie(req: any, name: string): string | null {
  const raw: string = req.headers?.cookie ?? "";
  const match = raw.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
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

  const raw = getCookie(req, "gt_session");
  if (!raw) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not authenticated" }));
    return;
  }

  try {
    const payload = jwt.verify(raw, JWT_SECRET) as { role: string; email: string; projectId: string | null };
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ role: payload.role, email: payload.email, projectId: payload.projectId ?? null }));
  } catch {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid session" }));
  }
}
