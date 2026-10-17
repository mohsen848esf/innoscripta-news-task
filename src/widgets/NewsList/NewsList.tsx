import { Button } from "@/shared/ui/Button/Button";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import { AlertCard } from "@/shared/ui/AlertCard/AlertCard";
import { RetryBanner } from "@/shared/ui/RetryBanner/RetryBanner";
import { useNews } from "@/entities/news/model/useNews";
import type { NewsItem, Search } from "@/entities/news/model/types";
import { NewsCard } from "@/entities/news/ui/NewsCard/NewsCard";
import { NewsGrid } from "./NewsGrid/NewsGrid";
import { NewsSkeleton } from "./NewsSkeleton/NewsSkeleton";
import styles from "./NewsList.module.css";

interface NewsListProps {
  search: Search;
  page: number;
  onPage: (page: number) => void;
}

export const NewsList = ({ search, page, onPage }: NewsListProps) => {
  const query = useNews(search, page);

  if (query.errors.length)
    return (
      <AlertCard title="Check your filters" error>
        {query.errors.map((error: string) => (
          <p key={error}>{error}</p>
        ))}
        {page > 1 && (
          <Button onClick={() => onPage(1)}>Back to first page</Button>
        )}
      </AlertCard>
    );

  if (query.isPending) return <NewsSkeleton />;

  if (query.isError || !query.data)
    return (
      <AlertCard title="Could not load news">
        <RetryBanner
          error={query.error}
          retrying={query.isFetching}
          onRetry={() => void query.refetch()}
        />
        {page > 1 && (
          <Button onClick={() => onPage(1)}>Back to first page</Button>
        )}
      </AlertCard>
    );

  const data = query.data;

  return (
    <section aria-label="News list" aria-busy={query.isFetching}>
      <div className={styles.heading}>
        <div>
          <h2>Latest news</h2>
          <p role="status">
            {data.total.toLocaleString()} results · Page {page}
            {data.pages > 0 ? " of " + data.pages : ""}
            {query.isFetching ? " · Updating…" : ""}
          </p>
        </div>
        <Button
          disabled={query.isFetching || query.isError}
          onClick={() => void query.refetch()}
        >
          {query.isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </div>
      {data.news.length ? (
        <NewsGrid>
          {data.news.map((item: NewsItem, index: number) => (
            <NewsCard
              key={item.url + "-" + index}
              news={item}
              priority={index === 0}
            />
          ))}
        </NewsGrid>
      ) : (
        <AlertCard
          title={page > 1 ? "No news on this page" : "No news found"}
        >
          <p>Try another keyword or change your filters.</p>
          {page > 1 && (
            <Button onClick={() => onPage(1)}>Back to first page</Button>
          )}
        </AlertCard>
      )}
      <Pagination
        page={page}
        pages={data.pages}
        onChange={onPage}
        disabled={query.isFetching}
      />
    </section>
  );
};
