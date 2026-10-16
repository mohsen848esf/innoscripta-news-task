import { handleApiError } from "@/shared/api/http";
import { Button } from "../Button/Button";
import styles from "./RetryBanner.module.css";

interface RetryBannerProps {
  error: unknown;
  onRetry: () => void;
  retrying?: boolean;
  label?: string;
}

export const RetryBanner = ({
  error,
  onRetry,
  retrying = false,
  label = "Try again",
}: RetryBannerProps) => {
  return (
    <div role="alert" className={styles.notice}>
      <p>{handleApiError(error)}</p>
      <Button disabled={retrying} onClick={onRetry}>
        {retrying ? "Retrying…" : label}
      </Button>
    </div>
  );
};
