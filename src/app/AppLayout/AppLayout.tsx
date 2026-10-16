import { Outlet } from "react-router";
import { Header } from "@/widgets/Header/Header";
import styles from "./AppLayout.module.css";

export const AppLayout = () => {
  return (
    <div className={styles.app}>
      <Header />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className={styles.footer}>INNOSCRIPTA NEWS TASK</footer>
    </div>
  );
};
