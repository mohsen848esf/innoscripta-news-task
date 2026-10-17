import { describe, expect, it } from "vitest";
import {
  generateSearchQueryParams,
  getFiltersFromUrl,
  validateFilterInputs,
} from "@/entities/news/lib/search-params";
import { initialSearchState } from "@/entities/news/lib/options";

describe("Search parameter serialization and validation", () => {
  it("serializes search filters to URLSearchParams", () => {
    const search = {
      ...initialSearchState,
      keyword: "economy",
      sort: "relevance" as const,
      categories: ["business"],
    };
    const params = generateSearchQueryParams(search, 2);

    expect(params.get("provider")).toBe("newsapi");
    expect(params.get("keyword")).toBe("economy");
    expect(params.get("sort")).toBe("relevance");
    expect(params.get("page")).toBe("2");
    expect(params.get("category")).toBe("business");
  });

  it("parses URLSearchParams back to Search state", () => {
    const params = new URLSearchParams(
      "provider=guardian&keyword=climate&page=3&sort=oldest",
    );
    const result = getFiltersFromUrl(params);

    expect(result.page).toBe(3);
    expect(result.search.provider).toBe("guardian");
    expect(result.search.keyword).toBe("climate");
    expect(result.search.sort).toBe("oldest");
  });

  it("validates invalid date ranges", () => {
    const search = {
      ...initialSearchState,
      from: "2026-10-20",
      to: "2026-10-10",
    };
    const errors = validateFilterInputs(search);
    expect(errors).toContain("Start date must be on or before end date.");
  });

  it("requires a keyword when sorting by relevance", () => {
    const search = {
      ...initialSearchState,
      keyword: "   ",
      sort: "relevance" as const,
    };
    const errors = validateFilterInputs(search);
    expect(errors).toContain("Enter a keyword to sort by relevance.");
  });
});
