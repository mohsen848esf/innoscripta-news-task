import { useSearchParams } from "react-router";
import { getFiltersFromUrl, generateSearchQueryParams } from "../lib/search-params";
import type { Search } from "./types";

export interface SearchQueryParamsHook {
  search: Search;
  page: number;
  applySearch: (next: Search) => void;
  changePage: (next: number) => void;
}

export const useSearchQueryParams = (): SearchQueryParamsHook => {
  // Reading the search parameters from URL query string
  const [params, setParams] = useSearchParams();
  const { search, page } = getFiltersFromUrl(params);

  return {
    search,
    page,
    applySearch: (next: Search) => {
      setParams(generateSearchQueryParams(next));
    },
    changePage: (next: number) => {
      setParams(generateSearchQueryParams(search, next));
    },
  };
};
