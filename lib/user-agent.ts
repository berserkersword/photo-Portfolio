/** User-Agent'dan brauzer, OS va qurilma turini taxminan aniqlaydi (kutubxonasiz) */
export function parseUserAgent(ua: string) {
  const pick = (list: [RegExp, string | ((m: RegExpMatchArray) => string)][]) => {
    for (const [re, name] of list) {
      const m = ua.match(re);
      if (m) return typeof name === "string" ? name : name(m);
    }
    return "Noma'lum";
  };

  const browser = pick([
    [/Telegram|TelegramBot/i, "Telegram"],
    [/Instagram/i, "Instagram ilovasi"],
    [/FBAN|FBAV/i, "Facebook ilovasi"],
    [/YaBrowser\/([\d]+)/, (m) => `Yandex ${m[1]}`],
    [/Edg\/([\d]+)/, (m) => `Edge ${m[1]}`],
    [/OPR\/([\d]+)/, (m) => `Opera ${m[1]}`],
    [/SamsungBrowser\/([\d]+)/, (m) => `Samsung Internet ${m[1]}`],
    [/(?:Chrome|CriOS)\/([\d]+)/, (m) => `Chrome ${m[1]}`],
    [/(?:Firefox|FxiOS)\/([\d]+)/, (m) => `Firefox ${m[1]}`],
    [/Version\/([\d.]+).*Safari/, (m) => `Safari ${m[1]}`],
  ]);

  const os = pick([
    [/iPhone OS ([\d_]+)/, (m) => `iOS ${m[1].replace(/_/g, ".")}`],
    [/iPad.*OS ([\d_]+)/, (m) => `iPadOS ${m[1].replace(/_/g, ".")}`],
    [/Android ([\d.]+)/, (m) => `Android ${m[1]}`],
    [/Windows NT 10/, "Windows 10/11"],
    [/Windows NT ([\d.]+)/, (m) => `Windows NT ${m[1]}`],
    [/Mac OS X ([\d_]+)/, (m) => `macOS ${m[1].replace(/_/g, ".")}`],
    [/CrOS/, "ChromeOS"],
    [/Linux/, "Linux"],
  ]);

  // Android telefon modeli: "...; SM-S918B Build/..." yoki "...; Pixel 8)"
  const model = ua.match(/Android [\d.]+; (?:[a-z]{2}-[a-z]{2}; )?([^;)]+?)(?: Build|\))/i)?.[1]?.trim();
  const device = /iPad|Tablet/i.test(ua)
    ? "Planshet"
    : /iPhone/.test(ua)
      ? "iPhone"
      : /Mobi|Android/i.test(ua)
        ? `Telefon${model && model !== "K" ? ` (${model})` : ""}`
        : "Kompyuter";

  const isBot = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|vercel/i.test(ua);
  return { browser, os, device, isBot };
}
