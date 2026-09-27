import sanitizeHtml from "sanitize-html";

export function cleanText(input: string | undefined | null): string {
  if (!input) return "";
  const cleaned = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
