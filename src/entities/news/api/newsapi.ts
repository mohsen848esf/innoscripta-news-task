import { z } from "zod";
import type { AxiosResponse } from "axios";
import { http } from "@/shared/api/http";
import { env } from "@/shared/config/env";
import { isHeadlinesMode } from "../lib/options";
import type { Search, Option, NewsResponse, NewsItem } from "../model/types";
import { calcTotalPages, checkHtml } from "./common";

const responseSchema = z.object({
  status: z.literal("ok"),
  totalResults: z.number().int().nonnegative(),
  articles: z.array(z.unknown()),
});

const newsSchema = z.object({
  title: z.string().nullable(),
  url: z.string(),
  description: z.string().nullable().nullish(),
  publishedAt: z.string(),
  urlToImage: z.string().nullish(),
  source: z.object({ name: z.string().nullish() }).nullish(),
});

export const generateNewsApiParams = (search: Search, page: number) => {
  const params: Record<string, string | number> = { page, pageSize: 10 };

  if (isHeadlinesMode(search)) {
    params.country = "us";
    if (search.categories[0]) {
      params.category = search.categories[0];
    }
  } else {
    params.language = "en";
    params.sortBy =
      (
        {
          newest: "publishedAt",
          popularity: "popularity",
          relevance: "relevancy",
        } as Record<string, string>
      )[search.sort] ?? "publishedAt";

    if (search.sources.length) {
      params.sources = search.sources.join(",");
    }
    if (search.from) {
      params.from = search.from;
    }
    if (search.to) {
      params.to = search.to;
    }
  }

  if (search.keyword) {
    params.q = search.keyword;
  }

  return params;
};

export const getNewsApiNews = async (
  search: Search,
  page: number,
  signal?: AbortSignal,
): Promise<NewsResponse> => {
  const { data }: AxiosResponse<unknown> = await http.get(
    env.VITE_NEWSAPI_BASE_URL +
      "/" +
      (isHeadlinesMode(search) ? "top-headlines" : "everything"),
    {
      params: generateNewsApiParams(search, page),
      headers: { "X-Api-Key": env.VITE_NEWSAPI_API_KEY },
      ...(signal ? { signal } : {}),
    },
  );

  const response = responseSchema.parse(data);

  // Normalizing the API response to match our unified news format
  const newsList: NewsItem[] = [];
  for (const item of response.articles) {
    const record = newsSchema.safeParse(item);
    if (!record.success) continue;

    const itemData = record.data;
    newsList.push({
      url: itemData.url ?? "",
      title: checkHtml(itemData.title),
      summary: checkHtml(itemData.description),
      image: itemData.urlToImage ?? "",
      publishedAt: itemData.publishedAt,
      publisher: checkHtml(itemData.source?.name) || "NewsAPI",
      author: "",
    });
  }

  return {
    news: newsList,
    total: response.totalResults,
    pages: calcTotalPages(response.totalResults, 100),
  };
};

export const getNewsApiSources = async (signal?: AbortSignal): Promise<Option[]> => {
  const { data }: AxiosResponse<unknown> = await http.get(
    env.VITE_NEWSAPI_BASE_URL + "/top-headlines/sources",
    {
      params: { language: "en" },
      headers: { "X-Api-Key": env.VITE_NEWSAPI_API_KEY },
      ...(signal ? { signal } : {}),
    },
  );

  const response = z
    .object({
      status: z.literal("ok"),
      sources: z.array(z.object({ id: z.string(), name: z.string() })),
    })
    .parse(data);

  return response.sources.map((source) => ({
    value: source.id,
    label: source.name,
  }));
};
