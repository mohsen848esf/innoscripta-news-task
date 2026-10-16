import { Link } from "react-router";
import { Newspaper } from "lucide-react";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} to="/">
          <span className={styles.icon}>
            <Newspaper size={22} aria-hidden="true" />
          </span>
          INNOSCRIPTA NEWS TASK
        </Link>
      </div>
    </header>
  );
};
