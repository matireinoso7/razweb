import { describe, it, expect } from "vitest";
import { RssNewsProvider } from "@/infrastructure/providers/rss-provider";
import { ArxivPapersProvider } from "@/infrastructure/providers/arxiv-provider";
import { SocialXProvider } from "@/infrastructure/providers/x-provider";

describe("News Providers (SOLID Architecture)", () => {
  it("RssNewsProvider conforms to INewsProvider contract and returns items", async () => {
    const provider = new RssNewsProvider([]);
    expect(provider.name).toBe("RSS Tech News Provider");
    expect(provider.sourceType).toBe("TECH_NEWS");

    const items = await provider.fetchLatestNews();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    expect(first.title).toBeDefined();
    expect(first.url).toBeDefined();
    expect(first.sourceType).toBe("TECH_NEWS");
    expect(first.publishedAt).toBeInstanceOf(Date);
  });

  it("ArxivPapersProvider conforms to INewsProvider contract and returns paper entities", async () => {
    const provider = new ArxivPapersProvider();
    expect(provider.name).toBe("arXiv AI Research Papers");
    expect(provider.sourceType).toBe("AI_PAPER");

    const items = await provider.fetchLatestNews();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    expect(first.title.startsWith("[Paper]")).toBe(true);
    expect(first.sourceType).toBe("AI_PAPER");
  });

  it("SocialXProvider conforms to INewsProvider contract and returns company X posts", async () => {
    const provider = new SocialXProvider();
    expect(provider.name).toBe("X (Twitter) AI Corporate Accounts");
    expect(provider.sourceType).toBe("X_POST");

    const items = await provider.fetchLatestNews();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    expect(first.sourceType).toBe("X_POST");
    expect(first.author?.startsWith("@")).toBe(true);
  });
});
