export const PUBLIC_PROFILE_TZ = "Asia/Jakarta";

export const CATEGORY_LABEL: Record<string, string> = { bullet: "Bullet", blitz: "Blitz", rapid: "Rapid", puzzle: "Puzzle", bot: "Bot" };
export const RESULT_LABEL: Record<string, string> = { win: "Menang", loss: "Kalah", draw: "Remi" };

export function formatJoinedLabel(createdAt: unknown): string {
  let ms = Number(createdAt);
  if (!Number.isFinite(ms) || ms <= 0) return "";
  if (ms < 1e11) ms *= 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return "";
  let text = "";
  try { text = d.toLocaleDateString("id-ID", { year: "numeric", month: "long", timeZone: PUBLIC_PROFILE_TZ }); } catch { text = ""; }
  if (!text || /invalid/i.test(text)) return "";
  return "Bergabung " + text;
}

export function formatGameDate(playedAt: unknown): string {
  let ms = Number(playedAt);
  if (!Number.isFinite(ms) || ms <= 0) return "";
  if (ms < 1e11) ms *= 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return "";
  let text = "";
  try { text = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: PUBLIC_PROFILE_TZ }); } catch { text = ""; }
  return !text || /invalid/i.test(text) ? "" : text;
}
