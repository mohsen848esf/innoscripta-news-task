import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { NewsItem } from "../../model/types";
import styles from "./NewsCard.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

interface NewsCardProps {
  news: NewsItem;
  priority?: boolean;
}

export const NewsCard = ({
  news,
  priority = false,
}: NewsCardProps) => {
  const [failed, setFailed] = useState(false);
  const date = new Date(news.publishedAt);

  return (
    <article className={styles.card}>
      <div className={styles.image}>
        {news.image && !failed ? (
          <img
            src={news.image}
            alt={news.title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setFailed(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <ImageOff aria-hidden="true" size={30} />
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.publisher}>{news.publisher}</p>
        <h3 className={styles.title}>
          <a href={news.url} target="_blank" rel="noopener noreferrer">
            {news.title || "Untitled news"}
          </a>
        </h3>
        {news.summary && <p className={styles.summary}>{news.summary}</p>}
        <div className={styles.details}>
          {news.author && <p className={styles.byline}>{news.author}</p>}
          {Number.isFinite(date.getTime()) && (
            <time dateTime={news.publishedAt}>
              {dateFormat.format(date)}
            </time>
          )}
        </div>
      </div>
    </article>
  );
};
