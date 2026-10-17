import type { Search } from "./types";

export const newsKeys = {
  news: (search: Search, page: number) =>
    [
      "news",
      search.provider,
      search.keyword,
      search.from,
      search.to,
      search.categories.join(","),
      search.sources.join(","),
      search.authors.map((author) => author.value).join(","),
      search.sort,
      page,
    ] as const,
  sources: () => ["news", "sources"] as const,
  authors: (keyword: string) => ["news", "authors", keyword] as const,
};
