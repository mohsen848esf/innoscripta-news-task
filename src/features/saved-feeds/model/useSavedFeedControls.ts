import { useEffect, useState } from "react";
import { isSameFilter, validateFilterInputs } from "@/entities/news/lib/search-params";
import { initialSearchState } from "@/entities/news/lib/options";
import type { SavedFeed } from "../types";
import type { Search } from "@/entities/news/model/types";
import { useSavedFeedsStorage } from "./useSavedFeedsStorage";
import { validateFeedName } from "./storage";

export const useSavedFeedControls = (
  search: Search,
  onSelect: (search: Search) => void,
) => {
  const saved = useSavedFeedsStorage();

  const [selectedId, setSelectedId] = useState(
    () => saved.feeds.find((feed) => isSameFilter(feed.search, search))?.id ?? "",
  );

  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [notice, setNotice] = useState("");

  const selected = saved.feeds.find((feed) => feed.id === selectedId);

  useEffect(() => {
    if (isSameFilter(search, initialSearchState)) {
      if (!selected || !isSameFilter(selected.search, initialSearchState)) {
        setSelectedId("");
      }
      return;
    }

    const exactMatch = saved.feeds.find((feed) => isSameFilter(feed.search, search));
    if (exactMatch && exactMatch.id !== selectedId) {
      setSelectedId(exactMatch.id);
    }
  }, [search, saved.feeds, selected, selectedId]);
  const select = (id: string) => {
    setSelectedId(id);
    setNotice("");
    const feed = saved.feeds.find((feed) => feed.id === id);
    if (feed) onSelect(feed.search);
  };

  const saveName = (name: string) => {
    const feed: SavedFeed = {
      id: modal === "edit" && selected ? selected.id : crypto.randomUUID(),
      name: name.trim(),
      search,
    };
    const feeds =
      modal === "edit"
        ? saved.feeds.map((existing) =>
            existing.id === feed.id ? feed : existing,
          )
        : [...saved.feeds, feed];

    if (saved.save(feeds)) {
      setSelectedId(feed.id);
      setNotice(modal === "edit" ? "Feed updated." : "Feed saved.");
      setModal(null);
    }
  };

  const remove = () => {
    if (saved.save(saved.feeds.filter((feed) => feed.id !== selectedId))) {
      setSelectedId("");
      setNotice("Feed deleted.");
      setModal(null);
    }
  };

  const reset = () => {
    if (saved.save([])) {
      setSelectedId("");
      setNotice("Saved data reset.");
    }
  };

  return {
    saved,
    selectedId,
    selected,
    modal,
    setModal,
    notice,
    disabled: !!saved.readError || validateFilterInputs(search).length > 0,
    changed: !!selected && !isSameFilter(selected.search, search),
    select,
    saveName,
    remove,
    reset,
    validateName: (name: string) =>
      validateFeedName(
        name,
        saved.feeds,
        modal === "edit" ? selectedId : undefined,
      ),
  };
};
