import { Button } from "../Button/Button";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  label?: string;
}

export const Pagination = ({
  page,
  pages,
  onChange,
  disabled = false,
  label = "News pages",
}: PaginationProps) => {
  if (pages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, pages - 4));

  const numbers = Array.from(
    { length: Math.min(5, pages) },
    (_, index) => start + index,
  );

  return (
    <nav className={styles.pagination} aria-label={label}>
      <Button
        disabled={disabled || page <= 1}
        onClick={() => onChange(1)}
        aria-label="First page"
      >
        «
      </Button>
      <Button
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>
      {numbers.map((number) => (
        <Button
          key={number}
          aria-label={"Page " + number}
          aria-current={number === page ? "page" : undefined}
          disabled={disabled || number === page}
          onClick={() => onChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        disabled={disabled || page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
      <Button
        disabled={disabled || page >= pages}
        onClick={() => onChange(pages)}
        aria-label="Last page"
      >
        »
      </Button>
    </nav>
  );
};
