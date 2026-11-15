/**
 * Telegram bot orqali xabar yuborish (faqat serverda).
 *
 * .env.local:
 *   TELEGRAM_BOT_TOKEN=123456:ABC...      — @BotFather bergan token
 *   TELEGRAM_USERNAME=your_nick            — xabar boradigan odam (@ siz)
 *   TELEGRAM_CHAT_ID=123456789             — ixtiyoriy, lekin ishonchliroq
 *
 * Muhim: Telegram botlari odamga nik orqali o'zi birinchi bo'lib yoza olmaydi —
 * avval o'sha odam botga /start yozishi kerak. Shundan keyin nik bo'yicha
 * chat ID topiladi (getUpdates) va xotirada saqlanadi. Topilgan ID server
 * logida chiqadi — uni TELEGRAM_CHAT_ID ga yozib qo'ysangiz, nikka bog'liqlik
 * qolmaydi (Telegram eski /start xabarlarini ~24 soatdan keyin unutadi).
 */

const API = "https://api.telegram.org";

let cachedChatId: string | null = null;

async function resolveChatId(token: string): Promise<string | null> {
  if (process.env.TELEGRAM_CHAT_ID) return process.env.TELEGRAM_CHAT_ID;
  if (cachedChatId) return cachedChatId;

  const username = process.env.TELEGRAM_USERNAME?.replace(/^@/, "").toLowerCase();
  if (!username) return null;

  const res = await fetch(`${API}/bot${token}/getUpdates?allowed_updates=["message"]`, { cache: "no-store" });
  if (!res.ok) {
    console.warn(`[telegram] getUpdates xatosi: ${res.status}`);
    return null;
  }
  const data = (await res.json()) as {
    result?: { message?: { chat?: { id: number; username?: string } } }[];
  };
  const chat = data.result
    ?.map((u) => u.message?.chat)
    .find((c) => c?.username?.toLowerCase() === username);

  if (!chat) {
    console.warn(`[telegram] @${username} topilmadi — u botga /start yozganmi?`);
    return null;
  }
  cachedChatId = String(chat.id);
  console.info(`[telegram] @${username} chat ID: ${cachedChatId} — .env.local ga TELEGRAM_CHAT_ID qilib yozib qo'ying`);
  return cachedChatId;
}

export const telegramConfigured = () =>
  Boolean(process.env.TELEGRAM_BOT_TOKEN && (process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_USERNAME));

/** HTML formatdagi xabar yuboradi. Xato bo'lsa sayt to'xtamaydi — faqat logga yoziladi. */
export async function sendTelegram(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;
  try {
    const chatId = await resolveChatId(token);
    if (!chatId) return false;
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
      cache: "no-store",
    });
    if (!res.ok) console.warn(`[telegram] sendMessage xatosi: ${res.status}`);
    return res.ok;
  } catch (e) {
    console.warn("[telegram] yuborib bo'lmadi:", (e as Error).message);
    return false;
  }
}

/** Telegram HTML uchun matnni xavfsiz qiladi */
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
