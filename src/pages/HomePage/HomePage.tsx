import { useRef } from "react";
import { useSearchQueryParams } from "@/entities/news/model/useSearchQueryParams";
import { SavedFeedControls } from "@/features/saved-feeds/ui/SavedFeedControls/SavedFeedControls";
import { FilterSidebar } from "@/widgets/FilterSidebar/FilterSidebar";
import { NewsList } from "@/widgets/NewsList/NewsList";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const { search, page, applySearch, changePage } = useSearchQueryParams();
  const results = useRef<HTMLDivElement>(null);

  const handlePage = (next: number) => {
    changePage(next);
    results.current?.scrollIntoView({ behavior: "instant" });
  };

  return (
    <>
      <div className={styles.intro}>
        <h1>Discover</h1>
      </div>
      <SavedFeedControls search={search} onSelect={applySearch} />
      <FilterSidebar search={search} onSearch={applySearch} />
      <div ref={results}>
        <NewsList search={search} page={page} onPage={handlePage} />
      </div>
    </>
  );
};

export default HomePage;
