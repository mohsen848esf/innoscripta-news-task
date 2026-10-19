# Innoscripta News Task

## Prerequisites
- Make sure you have [Docker installed](https://docs.docker.com/get-docker/) on your machine.
- After installing Docker, make sure it is running on your machine.

---

## Environment Variables

First, prepare your environment variables:
- In the "main" branch, make a copy of `.env.example` and rename it to `.env.local`:
  ```bash
  cp .env.example .env.local
  ```
- Edit the `.env.local` file with the API keys:
  ```dotenv
  VITE_NEWSAPI_BASE_URL=https://newsapi.org/v2
  VITE_NEWSAPI_API_KEY=6aad181aa74046f5a889fe4a3bf4ab11

  VITE_GUARDIAN_BASE_URL=https://content.guardianapis.com
  VITE_GUARDIAN_API_KEY=983f3e24-dc5b-48a8-9ef7-00a88e12ad91

  VITE_NYT_BASE_URL=https://api.nytimes.com/svc/search/v2
  VITE_NYT_API_KEY=MfGY6xjdasmGA7zDCckiZGVK0QJkQ9SiODbFEevV4Uby9r4B
  ```

---

## Running with Docker (Recommended)

Start the container using Docker Compose with your environment file:
```bash
docker compose --env-file .env.local up -d --build
```

Alternatively, you can build and run using Docker CLI directly by providing build arguments:
```bash
docker build \
  --build-arg VITE_NEWSAPI_API_KEY=6aad181aa74046f5a889fe4a3bf4ab11 \
  --build-arg VITE_GUARDIAN_API_KEY=983f3e24-dc5b-48a8-9ef7-00a88e12ad91 \
  --build-arg VITE_NYT_API_KEY=MfGY6xjdasmGA7zDCckiZGVK0QJkQ9SiODbFEevV4Uby9r4B \
  -t innoscripta-news .

docker run -p 8080:80 innoscripta-news
```

Open your browser and go to [http://localhost:8080](http://localhost:8080) to view the application.

---

## Running Locally

If you prefer to run the project locally without Docker:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

---

## Architecture

This project is structured using the [Feature-Sliced Design (FSD)](https://feature-sliced.design/) architectural methodology:

- `app`: Application setup, routes, TanStack Query client, and global styles.
- `pages`: Route-level views (`HomePage`, `NotFoundPage`, `ErrorPage`).
- `widgets`: Self-contained UI blocks (`Header`, `NewsList`, `FilterSidebar`).
- `features`: User interaction flows (`search-news`, `saved-feeds`).
- `entities`: Business domain models and API integrations (`news`).
- `shared`: Reusable UI components, Axios HTTP client, and common helpers.
