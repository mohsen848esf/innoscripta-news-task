import { z } from "zod";
import type { AxiosResponse } from "axios";
import { http } from "@/shared/api/http";
import { env } from "@/shared/config/env";
import type { Search, NewsResponse, NewsItem } from "../model/types";
import { calcTotalPages, checkHtml } from "./common";

const image = z.object({ url: z.string() });

const newsSchema = z.object({
  headline: z.object({ main: z.string() }),
  web_url: z.string(),
  abstract: z.string().nullish(),
  pub_date: z.string(),
  byline: z.object({ original: z.string().nullish() }).nullish(),
  multimedia: z
    .union([
      z.array(image),
      z.object({
        default: image.nullish(),
        thumbnail: image.nullish(),
      }),
    ])
    .nullish(),
});

export const generateNYTimesParams = (search: Search, page: number) => {
  let sortOrder = "newest";
  if (search.sort === "relevance") {
    sortOrder = "relevance";
  } else if (search.sort === "oldest") {
    sortOrder = "oldest";
  }

  const params: Record<string, string | number> = {
    page: page - 1,
    sort: sortOrder,
  };

  if (search.keyword) {
    params.q = search.keyword;
  }
  if (search.from) {
    params.begin_date = search.from.replaceAll("-", "");
  }
  if (search.to) {
    params.end_date = search.to.replaceAll("-", "");
  }

  if (search.categories.length) {
    params.fq = `section_name("${search.categories.join('" "')}")`;
  }

  return params;
};

export const getNytNews = async (
  search: Search,
  page: number,
  signal?: AbortSignal,
): Promise<NewsResponse> => {
  const { data }: AxiosResponse<unknown> = await http.get(
    env.VITE_NYT_BASE_URL + "/articlesearch.json",
    {
      params: {
        ...generateNYTimesParams(search, page),
        "api-key": env.VITE_NYT_API_KEY,
      },
      ...(signal ? { signal } : {}),
    },
  );

  const metadata = z.object({ hits: z.number().int().nonnegative() });
  const { response } = z
    .object({
      response: z.object({
        docs: z.array(z.unknown()),
        meta: metadata.nullish(),
        metadata: metadata.nullish(),
      }),
    })
    .parse(data);

  const total = (response.metadata ?? response.meta)?.hits;
  if (total === undefined) {
    throw new Error("Missing pagination info.");
  }

  // Normalizing the API response to match our unified news format
  const newsList: NewsItem[] = [];
  for (const item of response.docs) {
    const record = newsSchema.safeParse(item);
    if (!record.success) continue;

    const itemData = record.data;
    const media = itemData.multimedia;
    const image = Array.isArray(media)
      ? media[0]?.url
      : (media?.default?.url ?? media?.thumbnail?.url);

    newsList.push({
      url: itemData.web_url ?? "",
      title: checkHtml(itemData.headline.main),
      summary: checkHtml(itemData.abstract),
      image: image
        ? image.startsWith("http")
          ? image
          : "https://www.nytimes.com/" + image
        : "",
      publishedAt: itemData.pub_date,
      publisher: "The New York Times",
      author: checkHtml(itemData.byline?.original),
    });
  }

  return {
    news: newsList,
    total,
    pages: calcTotalPages(total, 1000),
  };
};
