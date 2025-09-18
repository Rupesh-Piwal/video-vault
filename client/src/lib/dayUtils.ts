import dayjs from "dayjs";

export type ExpiryPreset = "1h" | "12h" | "1d" | "30d" | "forever";

export function convertPresetToExpiry(preset: ExpiryPreset): string | null {
  const now = dayjs();
  switch (preset) {
    case "1h": return now.add(1, "hour").toISOString();
    case "12h": return now.add(12, "hour").toISOString();
    case "1d": return now.add(1, "day").toISOString();
    case "30d": return now.add(30, "day").toISOString();
    case "forever": return null;
    default: return null;
  }
}

export function isExpired(expiry: string | null) {
  if (!expiry) return false;
  return dayjs().isAfter(dayjs(expiry));
}

export function buildShareUrl(token: string) {
  const base = process.env.BASE_URL ?? "http://localhost:3000";
  return `${base}/share/${token}`;
}
