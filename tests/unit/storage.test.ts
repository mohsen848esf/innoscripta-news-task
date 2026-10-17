import { describe, expect, it, beforeEach } from "vitest";
import {
  getSavedFeeds,
  saveFeedsToStorage,
  storageKey,
} from "@/features/saved-feeds/model/storage";
import { initialSearchState } from "@/entities/news/lib/options";

describe("Saved feeds storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty list when storage is clean", () => {
    const result = getSavedFeeds();
    expect(result.feeds).toEqual([]);
    expect(result.error).toBe("");
  });

  it("saves and retrieves feeds correctly", () => {
    const feed = {
      id: "feed-1",
      name: "My Tech Feed",
      search: initialSearchState,
    };
    saveFeedsToStorage([feed]);

    const result = getSavedFeeds();
    expect(result.feeds).toHaveLength(1);
    expect(result.feeds[0]?.name).toBe("My Tech Feed");
  });

  it("recovers gracefully from corrupted JSON", () => {
    localStorage.setItem(storageKey, "invalid-json{{");
    const result = getSavedFeeds();
    expect(result.feeds).toEqual([]);
    expect(result.error).toContain("Could not read saved feeds.");
  });
});
