import type { Search } from "@/entities/news/model/types";

export interface SavedFeed {
  id: string;
  name: string;
  search: Search;
}
