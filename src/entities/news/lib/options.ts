import type { Option, Provider, Search } from "../model/types";

export const providers: Option[] = [
  { value: "newsapi", label: "NewsAPI" },
  { value: "guardian", label: "The Guardian" },
  { value: "nytimes", label: "The New York Times" },
];

const options = (values: string[]): Option[] =>
  values.map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));

export const categories: Record<Provider, Option[]> = {
  newsapi: options([
    "general",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ]),
  guardian: options([
    "business",
    "culture",
    "education",
    "environment",
    "fashion",
    "film",
    "football",
    "media",
    "music",
    "politics",
    "science",
    "society",
    "sport",
    "technology",
    "weather",
    "world",
  ]),
  nytimes: options([
    "World",
    "U.S.",
    "Business",
    "Technology",
    "Science",
    "Health",
    "Sports",
    "Arts",
  ]),
};

export const initialSearchState: Search = {
  provider: "newsapi",
  keyword: "",
  from: "",
  to: "",
  categories: [],
  sources: [],
  authors: [],
  sort: "default",
};

export const isHeadlinesMode = (search: Search): boolean => {
  return (
    search.provider === "newsapi" &&
    (search.categories.length > 0 ||
      (!search.keyword &&
        !search.sources.length &&
        !search.from &&
        !search.to))
  );
};

export const getSortOptions = (search: Search): Option[] => {
  if (isHeadlinesMode(search)) {
    return [{ value: "default", label: "Default order" }];
  }

  return [
    { value: "newest", label: "Newest" },
    ...(search.provider === "newsapi"
      ? [{ value: "popularity", label: "Most popular" }]
      : [{ value: "oldest", label: "Oldest" }]),
    { value: "relevance", label: "Most relevant" },
  ];
};
