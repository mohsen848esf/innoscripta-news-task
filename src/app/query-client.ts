import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: (failures: number, error: unknown) =>
          failures < 1 &&
          axios.isAxiosError(error) &&
          !axios.isCancel(error) &&
          (!error.response || error.response.status >= 500),
        retryDelay: 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
};
