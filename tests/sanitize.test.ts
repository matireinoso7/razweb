import { describe, it, expect } from "vitest";
import { cleanText, truncateText } from "@/lib/sanitize";

describe("Sanitization and Security Utilities", () => {
  it("strips malicious XSS script tags and harmful HTML attributes", () => {
    const malicious = '<script>alert("XSS")</script><p>Noticia segura <b onclick="hack()">AI</b></p>';
    const cleaned = cleanText(malicious);
    expect(cleaned).not.toContain("<script>");
    expect(cleaned).not.toContain("alert");
    expect(cleaned).not.toContain("onclick");
    expect(cleaned).toContain("Noticia segura AI");
  });

  it("handles empty or null text safely", () => {
    expect(cleanText(null)).toBe("");
    expect(cleanText(undefined)).toBe("");
    expect(cleanText("")).toBe("");
  });

  it("truncates long text properly with ellipsis", () => {
    const text = "Inteligencia artificial de vanguardia para aplicaciones de desarrollo.";
    const truncated = truncateText(text, 25);
    expect(truncated.length).toBeLessThanOrEqual(28);
    expect(truncated.endsWith("...")).toBe(true);
  });
});
