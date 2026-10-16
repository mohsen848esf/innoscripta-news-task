import type { ReactNode } from "react";
import styles from "./AlertCard.module.css";

interface AlertCardProps {
  title: string;
  children?: ReactNode;
  error?: boolean;
}

export const AlertCard = ({
  title,
  children,
  error = false,
}: AlertCardProps) => {
  return (
    <section className={styles.panel} role={error ? "alert" : undefined}>
      <h2>{title}</h2>
      {children}
    </section>
  );
};
