import { useQuery } from "@tanstack/react-query";
import { getNewsApiNews } from "../api/newsapi";
import { getGuardianNews } from "../api/guardian";
import { getNytNews } from "../api/nytimes";
import { newsKeys } from "./query-keys";
import { validateFilterInputs, validatePage } from "../lib/search-params";
import type { NewsResponse, Search } from "./types";

const fetchNewsByProvider = (
  search: Search,
  page: number,
  signal?: AbortSignal,
): Promise<NewsResponse> => {
  switch (search.provider) {
    case "guardian":
      return getGuardianNews(search, page, signal);
    case "nytimes":
      return getNytNews(search, page, signal);
    case "newsapi":
    default:
      return getNewsApiNews(search, page, signal);
  }
};

export interface NewsQueryResult {
  data: NewsResponse | undefined;
  error: unknown;
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => Promise<unknown>;
  errors: string[];
}

export const useNews = (search: Search, page: number): NewsQueryResult => {
  const errors = [...validateFilterInputs(search), ...validatePage(page)];
  const query = useQuery<NewsResponse>({
    queryKey: newsKeys.news(search, page),
    enabled: errors.length === 0,
    queryFn: ({ signal }) => fetchNewsByProvider(search, page, signal),
  });

  return {
    data: query.data,
    error: query.error,
    isPending: query.isPending,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
    errors,
  };
};
