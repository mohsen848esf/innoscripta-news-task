import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/useDebounce";
import { searchGuardianAuthors } from "@/entities/news/api/guardian";
import { newsKeys } from "@/entities/news/model/query-keys";
import type { Option } from "@/shared/types";

export interface AuthorSearchHook {
  options: Option[];
  isSearching: boolean;
  search: (value: string) => void;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  refetch: () => void;
}

export const useAuthorSearch = (enabled: boolean): AuthorSearchHook => {
  const [input, setInput] = useState("");
  const keyword = useDebounce(input.trim());
  const ready = enabled && keyword.length >= 2 && keyword === input.trim();

  const query = useQuery<Option[]>({
    queryKey: newsKeys.authors(keyword),
    enabled: ready,
    staleTime: 3_600_000,
    gcTime: 3_600_000,
    queryFn: ({ signal }) => searchGuardianAuthors(keyword, signal),
  });

  return {
    options: ready ? (query.data ?? []) : [],
    isSearching: enabled && (keyword !== input.trim() || query.isFetching),
    search: setInput,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: () => void query.refetch(),
  };
};
