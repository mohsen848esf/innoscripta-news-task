import { Link } from "react-router";
import { AlertCard } from "@/shared/ui/AlertCard/AlertCard";

export const NotFoundPage = () => {
  return (
    <AlertCard title="Page not found">
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Back to Discover</Link>
    </AlertCard>
  );
};
