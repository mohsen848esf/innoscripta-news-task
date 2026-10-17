import type { SavedFeed } from "../types";
import { useState } from "react";
import { getSavedFeeds, saveFeedsToStorage } from "./storage";

export const useSavedFeedsStorage = () => {
  const [state, setState] = useState(getSavedFeeds);
  const [writeError, setWriteError] = useState("");

  const save = (feeds: SavedFeed[]): boolean => {
    try {
      saveFeedsToStorage(feeds);
      setState({ feeds, error: "" });
      return true;
    } catch {
      setWriteError("Could not save changes. Try again.");
      return false;
    }
  };

  return {
    feeds: state.feeds,
    readError: state.error,
    error: state.error || writeError,
    save,
  };
};
