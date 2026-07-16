// Standalone, dependency-light serverless function — replaces the
// POST /api/admin/generate-invites endpoint that used to live in
// api/index.ts (that monolithic Express app was found unresponsive in
// production, so this had to move out too, same as the rest of auth).
// Only dependency is jsonwebtoken. No Firestore/Firebase/Google involved:
// passes are self-contained signed JWTs, nothing is persisted server-side.

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function getCookie(req: any, name: string): string | null {
  const raw: string = req.headers?.cookie ?? "";
  const match = raw.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

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

  const raw = getCookie(req, "gt_session");
  if (!raw) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not authenticated" }));
    return;
  }

  try {
    const session = jwt.verify(raw, JWT_SECRET) as { role: string };
    if (session.role !== "admin") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Admin only" }));
      return;
    }
  } catch {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Invalid session" }));
    return;
  }

  let body: any = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  } catch {
    body = {};
  }

  const { projectId, projectName, clientEmail, builderEmails } = body ?? {};
  const passes: { email: string; role: string; pass: string }[] = [];

  const generatePass = (email: string, role: "client" | "builder") =>
    jwt.sign(
      { email: email.toLowerCase(), role, projectId: projectId ?? null, projectName: projectName ?? null, type: "invite" },
      JWT_SECRET,
      { expiresIn: "90d" }
    );

  if (typeof clientEmail === "string" && clientEmail.trim()) {
    passes.push({ email: clientEmail.trim(), role: "client", pass: generatePass(clientEmail.trim(), "client") });
  }
  for (const email of builderEmails ?? []) {
    if (typeof email !== "string" || !email.trim()) continue;
    passes.push({ email: email.trim(), role: "builder", pass: generatePass(email.trim(), "builder") });
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true, passes }));
}
