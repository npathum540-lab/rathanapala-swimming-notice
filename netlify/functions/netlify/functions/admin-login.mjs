import { createHmac, timingSafeEqual } from "node:crypto";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });

export default async (request) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!password || !secret || secret.length < 32) {
    return json({ error: "Admin settings are not configured." }, 500);
  }

  let data;

  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const submitted = typeof data.password === "string"
    ? data.password : "";

  if (!submitted || submitted.length > 200) {
    return json({ error: "වැරදි මුරපදය." }, 401);
  }

  const expectedPassword = Buffer.from(password);
  const submittedPassword = Buffer.from(submitted);

  if (
    expectedPassword.length !== submittedPassword.length ||
    !timingSafeEqual(expectedPassword, submittedPassword)
  ) {
    return json({ error: "වැරදි මුරපදය." }, 401);
  }

  const payload = Buffer.from(JSON.stringify({
    role: "admin",
    exp: Date.now() + 8 * 60 * 60 * 1000
  })).toString("base64url");

  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return json({
    ok: true,
    token: `${payload}.${signature}`
  });
};

export const config = {
  path: "/api/admin-login"
};
