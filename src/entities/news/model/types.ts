import type { Option } from "@/shared/types";
export type { Option } from "@/shared/types";

export const providerValues = ["newsapi", "guardian", "nytimes"] as const;

export const sortValues = [
  "default",
  "newest",
  "oldest",
  "relevance",
  "popularity",
] as const;

export type Provider = (typeof providerValues)[number];

export type Sort = (typeof sortValues)[number];

export interface Search {
  provider: Provider;
  keyword: string;
  from: string;
  to: string;
  categories: string[];
  sources: string[];
  authors: Option[];
  sort: Sort;
}

export interface NewsItem {
  url: string;
  title: string;
  summary: string;
  image: string;
  publishedAt: string;
  publisher: string;
  author: string;
}

export interface NewsResponse {
  news: NewsItem[];
  total: number;
  pages: number;
}
