import {
  categories,
  initialSearchState,
  isHeadlinesMode,
  getSortOptions,
} from "./options";
import { providerValues, type Search } from "../model/types";

export const validateFilterInputs = (search: Search): string[] => {
  const errors: string[] = [];

  if (!providerValues.includes(search.provider)) {
    return ["Choose a valid data source."];
  }

  for (const [label, value] of [
    ["Start date", search.from],
    ["End date", search.to],
  ] as const) {
    if (
      value &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        Number.isNaN(Date.parse(value)) ||
        value < "1900-01-01" ||
        value > "2100-01-01")
    ) {
      errors.push(label + " is invalid.");
    }
  }

  if (search.from && search.to && search.from > search.to) {
    errors.push("Start date must be on or before end date.");
  }

  if (
    search.categories.some(
      (id) =>
        !categories[search.provider].some((option) => option.value === id),
    )
  ) {
    errors.push("Choose categories available for this data source.");
  }

  if (search.provider === "newsapi" && search.sources.length > 20) {
    errors.push("Select at most 20 sources.");
  }

  if (search.provider === "newsapi") {
    if (search.categories.length > 1) {
      errors.push("NewsAPI supports one category at a time.");
    }
    if (search.sources.length && search.categories.length) {
      errors.push("NewsAPI categories cannot be combined with sources.");
    }
    if (search.categories.length && (search.from || search.to)) {
      errors.push("NewsAPI categories cannot be combined with dates.");
    }
    if (search.sort === "popularity" && isHeadlinesMode(search)) {
      errors.push(
        "NewsAPI category headlines cannot be sorted by popularity.",
      );
    }
    if (search.sort === "oldest") {
      errors.push("NewsAPI does not support oldest-first sorting.");
    }
    if (
      search.sources.length &&
      search.sources.some(
        (source) =>
          search.categories.length &&
          !categories.newsapi.some((category) => category.value === source),
      )
    ) {
      errors.push(
        "Choose publishers available with the current configuration.",
      );
    }
  } else if (search.sources.length) {
    errors.push("Sources(publisher) selection is available with NewsAPI.");
  }

  if (search.provider !== "guardian" && search.authors.length) {
    errors.push("Author selection is available with The Guardian.");
  }

  if (!getSortOptions(search).some((option) => option.value === search.sort)) {
    errors.push("Choose a sort order available for this search.");
  }

  if (search.sort === "relevance" && !search.keyword.trim()) {
    errors.push("Enter a keyword to sort by relevance.");
  }

  return errors;
};

export const sanitizeSearchParams = (search: Search): Search => {
  const normalized = {
    ...search,
    keyword: search.keyword.trim(),
    categories: [...new Set(search.categories)],
    sources: [...new Set(search.sources)],
  };

  if (normalized.sort === "default" && !isHeadlinesMode(normalized)) {
    normalized.sort = "newest";
  }

  return normalized;
};

export const generateSearchQueryParams = (search: Search, page = 1): URLSearchParams => {
  const params = new URLSearchParams({ provider: search.provider });

  for (const key of ["keyword", "from", "to", "sort"] as const) {
    if (search[key]) params.set(key, search[key]);
  }

  for (const value of search.categories) {
    params.append("category", value);
  }

  for (const value of search.sources) {
    params.append("source", value);
  }

  for (const author of search.authors) {
    params.append("author", author.value);
    params.append("authorName", author.label);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return params;
};

export const getFiltersFromUrl = (
  params: URLSearchParams,
): {
  search: Search;
  page: number;
} => {
  const names = params.getAll("authorName");
  const search = sanitizeSearchParams({
    ...initialSearchState,
    provider: (
      {
        newsapi: "newsapi",
        guardian: "guardian",
        nytimes: "nytimes",
      } as const
    )[params.get("provider") ?? ""] ?? "newsapi",
    keyword: params.get("keyword") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    sort: (
      {
        default: "default",
        newest: "newest",
        oldest: "oldest",
        relevance: "relevance",
        popularity: "popularity",
      } as const
    )[params.get("sort") ?? ""] ?? "default",
    categories: params.getAll("category"),
    sources: params.getAll("source"),
    authors: params
      .getAll("author")
      .map((value, index) => ({ value, label: names[index] ?? value })),
  });
  const page = Number(params.get("page") ?? 1);

  return { search, page: Number.isSafeInteger(page) && page > 0 ? page : 1 };
};

export const validatePage = (page: number): string[] => {
  if (!Number.isSafeInteger(page) || page < 1) {
    return ["Choose a valid page."];
  }
  return [];
};

export const updateFilterField = (current: Search, patch: Partial<Search>): Search => {
  if (patch.provider !== undefined && patch.provider !== current.provider) {
    return {
      ...initialSearchState,
      provider: patch.provider,
    };
  }

  const next = { ...current, ...patch };

  if (next.provider === "newsapi") {
    if (patch.categories?.length) {
      next.sources = [];
    } else if (patch.sources?.length) {
      next.categories = [];
    }
    if (patch.categories?.length || patch.sources?.length) {
      next.from = "";
      next.to = "";
    }
  }

  if (patch.provider) {
    if (
      !categories[next.provider].some(
        (category) => category.value === next.categories[0],
      )
    ) {
      next.categories = [];
    }
  }

  if (isHeadlinesMode(next)) {
    next.sort = "default";
  } else if (next.sort === "default") {
    next.sort = "newest";
  }

  return next;
};

export const formatSearchForSubmit = (draft: Search) => {
  const search = sanitizeSearchParams(draft);
  if (isHeadlinesMode(search)) {
    search.sort = "default";
  }

  return { search, errors: validateFilterInputs(search) };
};

export const isSameFilter = (left: Search, right: Search): boolean => {
  const getSearchSignature = (search: Search) =>
    generateSearchQueryParams({
      ...sanitizeSearchParams(search),
      categories: [...search.categories].sort(),
      sources: [...search.sources].sort(),
      authors: [...search.authors]
        .map((author) => ({ value: author.value, label: author.value }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    }).toString();

  return getSearchSignature(left) === getSearchSignature(right);
};
