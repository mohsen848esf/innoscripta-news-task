import { z } from "zod";
import type { AxiosResponse } from "axios";
import { http } from "@/shared/api/http";
import { env } from "@/shared/config/env";
import type { Search, Option, NewsResponse, NewsItem } from "../model/types";
import { calcTotalPages, checkHtml } from "./common";

const newsSchema = z.object({
  webTitle: z.string(),
  webUrl: z.string(),
  webPublicationDate: z.string(),
  fields: z
    .object({
      trailText: z.string().nullish(),
      thumbnail: z.string().nullish(),
      byline: z.string().nullish(),
    })
    .nullish(),
  tags: z.array(z.object({ type: z.string(), webTitle: z.string() })).nullish(),
});

export const generateGuardianParams = (search: Search, page: number) => {
  const params: Record<string, string | number> = {
    page,
    "page-size": 10,
    "order-by":
      search.sort === "relevance"
        ? "relevance"
        : search.sort === "oldest"
          ? "oldest"
          : "newest",
    "show-fields": "thumbnail,trailText,byline",
    "show-tags": "contributor",
  };

  if (search.keyword) {
    params.q = search.keyword;
  }
  if (search.from) {
    params["from-date"] = search.from;
  }
  if (search.to) {
    params["to-date"] = search.to;
  }
  if (search.categories.length) {
    params.section = search.categories.join("|");
  }
  if (search.authors.length) {
    params.tag = search.authors.map((author) => author.value).join("|");
  }

  return params;
};

export const getGuardianNews = async (
  search: Search,
  page: number,
  signal?: AbortSignal,
): Promise<NewsResponse> => {
  const { data }: AxiosResponse<unknown> = await http.get(
    env.VITE_GUARDIAN_BASE_URL + "/search",
    {
      params: {
        ...generateGuardianParams(search, page),
        "api-key": env.VITE_GUARDIAN_API_KEY,
      },
      ...(signal ? { signal } : {}),
    },
  );

  const { response } = z
    .object({
      response: z.object({
        status: z.literal("ok"),
        total: z.number().int().nonnegative(),
        results: z.array(z.unknown()),
      }),
    })
    .parse(data);

  // Normalizing the API response to match our unified news format
  const newsList: NewsItem[] = [];
  for (const item of response.results) {
    const record = newsSchema.safeParse(item);
    if (!record.success) continue;

    const itemData = record.data;
    newsList.push({
      url: itemData.webUrl ?? "",
      title: checkHtml(itemData.webTitle),
      summary: checkHtml(itemData.fields?.trailText),
      image: itemData.fields?.thumbnail ?? "",
      publishedAt: itemData.webPublicationDate,
      publisher: "The Guardian",
      author:
        checkHtml(itemData.fields?.byline) ||
        itemData.tags
          ?.filter((tag) => tag.type === "contributor")
          .map((tag) => checkHtml(tag.webTitle))
          .join(", ") ||
        "",
    });
  }

  return {
    news: newsList,
    total: response.total,
    pages: calcTotalPages(response.total),
  };
};

export const searchGuardianAuthors = async (
  keyword: string,
  signal?: AbortSignal,
): Promise<Option[]> => {
  const { data }: AxiosResponse<unknown> = await http.get(
    env.VITE_GUARDIAN_BASE_URL + "/tags",
    {
      params: {
        q: keyword,
        type: "contributor",
        "page-size": 20,
        "api-key": env.VITE_GUARDIAN_API_KEY,
      },
      ...(signal ? { signal } : {}),
    },
  );

  const { response } = z
    .object({
      response: z.object({
        status: z.literal("ok"),
        results: z.array(z.object({ id: z.string(), webTitle: z.string() })),
      }),
    })
    .parse(data);

  return response.results.map((author) => ({
    value: author.id,
    label: checkHtml(author.webTitle),
  }));
};
