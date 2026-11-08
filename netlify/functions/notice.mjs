import { createHmac, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  }
});

function validToken(request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return false;

  const parts = header.slice(7).split(".");
  if (parts.length !== 2) return false;

  const expected = createHmac("sha256", secret)
    .update(parts[0]).digest();

  const actual = Buffer.from(parts[1], "base64url");
  if (actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8")
    );
    return payload.role === "admin" &&
      Number(payload.exp) > Date.now();
  } catch {
    return false;
  }
}

const store = () => getStore("school-notice-board");

export default async (request) => {
  if (request.method === "GET") {
    try {
      const data = await (await store()).get("current", { type: "json" });
      return json(data || { message: "", visible: false });
    } catch {
      return json({ message: "", visible: false });
    }
  }

  if (request.method === "POST") {
    if (!validToken(request)) {
      return json({ error: "Unauthorized" }, 401);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: "Invalid request" }, 400);
    }

    const message = typeof data.message === "string"
      ? data.message.trim() : "";
    const visible = data.visible !== false;

    if (message.length > 1200) {
      return json({ error: "පණිවිඩය අකුරු 1200කට සීමා කරන්න." }, 400);
    }

    if (visible && !message) {
      return json({ error: "පණිවිඩයක් ඇතුළත් කරන්න." }, 400);
    }

    const record = {
      message,
      visible,
      updatedAt: new Date().toISOString()
    };

    try {
      await (await store()).setJSON("current", record);
      return json({ ok: true, updatedAt: record.updatedAt });
    } catch {
      return json({ error: "Notice එක සුරැකීමට නොහැකි වුණා." }, 500);
    }
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = { path: "/api/notice" };
