import { z } from "zod";
import { providerValues, sortValues } from "@/entities/news/model/types";
import type { SavedFeed } from "../types";

export const storageKey = "newsroom.saved-feeds";

const searchSchema = z.object({
  provider: z.enum(providerValues),
  keyword: z.string(),
  from: z.string(),
  to: z.string(),
  categories: z.array(z.string()),
  sources: z.array(z.string()),
  authors: z.array(z.object({ value: z.string(), label: z.string() })),
  sort: z.enum(sortValues),
});

const storageSchema = z.object({
  version: z.literal(1),
  feeds: z.array(
    z.object({ id: z.string(), name: z.string(), search: searchSchema }),
  ),
});

// Loading the stored filters from local storage
export const getSavedFeeds = (): { feeds: SavedFeed[]; error: string } => {
  try {
    const raw = localStorage.getItem(storageKey);

    if (!raw) return { feeds: [], error: "" };

    const result = storageSchema.safeParse(JSON.parse(raw) as unknown);
    if (!result.success) throw new Error();

    return { feeds: result.data.feeds, error: "" };
  } catch {
    return {
      feeds: [],
      error: "Could not read saved feeds.",
    };
  }
};

// Saving updated filters array to local storage
export const saveFeedsToStorage = (feeds: SavedFeed[]): void => {
  const data = storageSchema.parse({ version: 1, feeds });
  localStorage.setItem(storageKey, JSON.stringify(data));
};

export const validateFeedName = (
  name: string,
  feeds: SavedFeed[],
  id?: string,
): string => {
  if (!name.trim()) return "Enter a feed name.";

  if (
    feeds.some(
      (feed) =>
        feed.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        feed.id !== id,
    )
  )
    return "A feed with this name already exists.";

  return "";
};
