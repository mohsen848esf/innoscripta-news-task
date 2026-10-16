import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { AppLayout } from "./AppLayout/AppLayout";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";
import { NewsSkeleton } from "@/widgets/NewsList/NewsSkeleton/NewsSkeleton";

const HomePage = lazy(() => import("@/pages/HomePage/HomePage"));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<NewsSkeleton />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
