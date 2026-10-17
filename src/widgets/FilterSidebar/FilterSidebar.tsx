import { useId } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/shared/ui/Button/Button";
import { generateSearchQueryParams } from "@/entities/news/lib/search-params";
import type { Search } from "@/entities/news/model/types";
import { useMobileFilters } from "./useMobileFilters";
import { SearchForm } from "@/features/search-news/ui/SearchForm/SearchForm";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  search: Search;
  onSearch: (search: Search) => void;
}

export const FilterSidebar = ({ search, onSearch }: FilterSidebarProps) => {
  const id = useId();
  const { dialog, trigger, mobile, open, show, close } = useMobileFilters();

  return (
    <>
      <Button
        ref={trigger}
        className={styles.toggle}
        aria-expanded={mobile ? open : undefined}
        aria-controls={id}
        onClick={show}
      >
        <SlidersHorizontal size={18} aria-hidden="true" /> Filters
      </Button>

      <dialog
        ref={dialog}
        data-news-filters
        id={id}
        role={mobile ? "dialog" : "region"}
        aria-label="Filter news"
        className={styles.container}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (mobile && event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right) {
              close();
            }
          }
        }}
      >
        <div className={styles.header}>
          <h2>Filters</h2>
          {mobile && (
            <Button
              variant="secondary"
              aria-label="Close filters"
              onClick={close}
            >
              <X size={18} aria-hidden="true" />
            </Button>
          )}
        </div>
        <SearchForm
          key={generateSearchQueryParams(search).toString()}
          initial={search}
          onSearch={(next) => {
            onSearch(next);
            if (mobile) close();
          }}
        />
      </dialog>
    </>
  );
};
