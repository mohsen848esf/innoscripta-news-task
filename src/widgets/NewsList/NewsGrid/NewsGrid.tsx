import type { ReactNode } from "react";
import styles from "./NewsGrid.module.css";

export const NewsGrid = ({ children }: { children: ReactNode }) => {
  return <div className={styles.grid}>{children}</div>;
};
