import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getNewsApiSources } from "@/entities/news/api/newsapi";
import { newsKeys } from "@/entities/news/model/query-keys";
import type { Option } from "@/shared/types";

export const useSourcesList = (
  enabled: boolean,
): UseQueryResult<Option[], Error> => {
  return useQuery<Option[]>({
    queryKey: newsKeys.sources(),
    enabled,
    staleTime: 3_600_000,
    gcTime: 3_600_000,
    queryFn: ({ signal }) => getNewsApiSources(signal),
  });
};
