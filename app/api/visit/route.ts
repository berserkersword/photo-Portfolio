import { after } from "next/server";
import { esc, sendTelegram, telegramConfigured } from "@/lib/telegram";
import { parseUserAgent } from "@/lib/user-agent";

/**
 * POST /api/visit — saytga kirgan har bir tashrif haqida Telegram'ga xabar.
 * Brauzerdan components/VisitTracker.tsx chaqiradi (bir tashrifga bir marta).
 * Botlar va bir IP'dan qisqa vaqtda kelgan takroriy so'rovlar e'tiborsiz qoldiriladi.
 */

const REPEAT_MS = 10 * 60 * 1000; // bir IP'dan 10 daqiqada bitta xabar
const recent = new Map<string, number>();

interface ClientInfo {
  path?: string;
  referrer?: string;
  screen?: string;
  language?: string;
  timezone?: string;
}

const clip = (v: unknown, n = 200) => (typeof v === "string" ? v.slice(0, n) : "");

export async function POST(request: Request) {
  if (!telegramConfigured()) return new Response(null, { status: 204 });

  const h = request.headers;
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "noma'lum";
  const ua = h.get("user-agent") ?? "";
  const { browser, os, device, isBot } = parseUserAgent(ua);
  if (isBot) return new Response(null, { status: 204 });

  const now = Date.now();
  if (now - (recent.get(ip) ?? 0) < REPEAT_MS) return new Response(null, { status: 204 });
  recent.set(ip, now);
  if (recent.size > 5000) for (const [k, t] of recent) if (now - t > REPEAT_MS) recent.delete(k);

  let info: ClientInfo = {};
  try {
    info = JSON.parse(await request.text());
  } catch {}

  // Hosting joylashuvni sarlavhada bersa (Vercel / Cloudflare) — shahar va davlat
  const city = h.get("x-vercel-ip-city") ? decodeURIComponent(h.get("x-vercel-ip-city")!) : "";
  const country = h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || "";
  const place = [city, country].filter(Boolean).join(", ");

  const referrer = clip(info.referrer);
  const time = new Date().toLocaleString("en-GB", { timeZone: "Asia/Tashkent" });

  const lines = [
    "👀 <b>Saytga yangi tashrif</b>",
    "",
    `🌐 <b>IP:</b> <code>${esc(ip)}</code>${place ? ` (${esc(place)})` : ""}`,
    `📱 <b>Qurilma:</b> ${esc(device)}`,
    `💻 <b>Tizim:</b> ${esc(os)}`,
    `🧭 <b>Brauzer:</b> ${esc(browser)}`,
    info.screen ? `🖥 <b>Ekran:</b> ${esc(clip(info.screen, 20))}` : "",
    info.language ? `🗣 <b>Til:</b> ${esc(clip(info.language, 20))}` : "",
    info.timezone ? `🕒 <b>Vaqt zonasi:</b> ${esc(clip(info.timezone, 50))}` : "",
    `📄 <b>Sahifa:</b> ${esc(clip(info.path) || "/")}`,
    `↪️ <b>Qayerdan:</b> ${referrer ? esc(referrer) : "to'g'ridan-to'g'ri"}`,
    `⏰ ${esc(time)} (Toshkent)`,
  ].filter(Boolean);

  // Javob kutib turmaydi — xabar javob qaytgandan keyin yuboriladi
  after(() => sendTelegram(lines.join("\n")));
  return new Response(null, { status: 204 });
}
