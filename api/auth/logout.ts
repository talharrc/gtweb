// Standalone serverless function — clears the gt_session cookie for ALL roles,
// moved out of api/index.ts's monolithic Express app (found unresponsive in
// production). No dependencies, no Firestore/Firebase/Google involved.

export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  res.setHeader("Set-Cookie", "gt_session=; Path=/; HttpOnly; Max-Age=0");
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true }));
}
