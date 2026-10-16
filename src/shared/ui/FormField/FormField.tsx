import type { ReactNode } from "react";
import styles from "./FormField.module.css";

export interface FieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | undefined;
  className?: string | undefined;
}

export const FormField = ({
  id,
  label,
  hint,
  error,
  className,
  children,
}: FieldProps & { children: ReactNode }) => {
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <div id={id + "-hint"} className={styles.hint}>
          {hint}
        </div>
      )}
      {error && (
        <p id={id + "-error"} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
};
