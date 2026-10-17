import { NewsGrid } from "../NewsGrid/NewsGrid";
import styles from "./NewsSkeleton.module.css";

export const NewsSkeleton = () => {
  return (
    <section aria-label="Loading news" aria-busy="true" role="status">
      <span className={styles.srOnly}>Loading news…</span>
      <NewsGrid>
        {Array.from({ length: 6 }, (_, index) => (
          <div aria-hidden="true" key={index} className={styles.card}>
            <div />
            <p />
            <p />
          </div>
        ))}
      </NewsGrid>
    </section>
  );
};
