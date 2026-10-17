import { describe, expect, it, vi, beforeEach } from "vitest";
import { http } from "@/shared/api/http";
import {
  generateGuardianParams,
  getGuardianNews,
} from "@/entities/news/api/guardian";
import {
  generateNewsApiParams,
  getNewsApiNews,
} from "@/entities/news/api/newsapi";
import {
  generateNYTimesParams,
  getNytNews,
} from "@/entities/news/api/nytimes";
import { initialSearchState } from "@/entities/news/lib/options";

vi.mock("@/shared/api/http", () => ({
  http: {
    get: vi.fn(),
  },
}));

describe("Provider API integrations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds correct Guardian parameters and parses response", async () => {
    const search = {
      ...initialSearchState,
      provider: "guardian" as const,
      keyword: "tech",
    };
    const params = generateGuardianParams(search, 1);
    expect(params.q).toBe("tech");
    expect(params.page).toBe(1);

    vi.mocked(http.get).mockResolvedValueOnce({
      data: {
        response: {
          status: "ok",
          total: 1,
          results: [
            {
              webTitle: "Test News",
              webUrl: "https://example.com/test",
              webPublicationDate: "2026-10-17T12:00:00Z",
              fields: { trailText: "Summary", thumbnail: "img.jpg" },
            },
          ],
        },
      },
    });

    const result = await getGuardianNews(search, 1);
    expect(result.news[0]?.title).toBe("Test News");
    expect(result.total).toBe(1);
  });

  it("builds correct NewsAPI parameters and handles top headlines", async () => {
    const search = {
      ...initialSearchState,
      provider: "newsapi" as const,
      categories: ["technology"],
    };
    const params = generateNewsApiParams(search, 1);
    expect(params.country).toBe("us");
    expect(params.category).toBe("technology");

    vi.mocked(http.get).mockResolvedValueOnce({
      data: {
        status: "ok",
        totalResults: 1,
        articles: [
          {
            title: "NewsAPI Story",
            url: "https://example.com/story",
            publishedAt: "2026-10-17T10:00:00Z",
          },
        ],
      },
    });

    const result = await getNewsApiNews(search, 1);
    expect(result.news[0]?.title).toBe("NewsAPI Story");
    expect(result.total).toBe(1);
  });

  it("builds NYTimes parameters and calculates pagination", async () => {
    const search = {
      ...initialSearchState,
      provider: "nytimes" as const,
      from: "2026-10-01",
    };
    const params = generateNYTimesParams(search, 2);
    expect(params.page).toBe(1);
    expect(params.begin_date).toBe("20261001");

    vi.mocked(http.get).mockResolvedValueOnce({
      data: {
        response: {
          docs: [
            {
              headline: { main: "NYT Headline" },
              web_url: "https://example.com/nyt",
              pub_date: "2026-10-17T08:00:00Z",
            },
          ],
          meta: { hits: 25 },
        },
      },
    });

    const result = await getNytNews(search, 2);
    expect(result.news[0]?.title).toBe("NYT Headline");
    expect(result.total).toBe(25);
    expect(result.pages).toBe(3);
  });
});
