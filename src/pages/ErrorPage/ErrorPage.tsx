import { Button } from "@/shared/ui/Button/Button";
import { AlertCard } from "@/shared/ui/AlertCard/AlertCard";
import styles from "./ErrorPage.module.css";

export const ErrorPage = () => {
  return (
    <main className={styles.page}>
      <AlertCard title="Something went wrong" error>
        <p>Could not load page. Please reload.</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <a href="/">Back to Discover</a>
      </AlertCard>
    </main>
  );
};
