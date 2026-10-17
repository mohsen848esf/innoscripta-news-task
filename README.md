# Innoscripta News Task

## Prerequisites
- Make sure you have [Docker installed](https://docs.docker.com/get-docker/) on your machine.
- After installing Docker, make sure it is running on your machine.

---

## Environment Variables

First, prepare your environment variables:
- In the "master" branch, make a copy of `.env.example` and rename it to `.env.local`:
  ```bash
  cp .env.example .env.local
  ```
- Edit the `.env.local` file with your API keys:
  ```dotenv
  VITE_NEWSAPI_BASE_URL=https://newsapi.org/v2
  VITE_NEWSAPI_API_KEY=your_newsapi_key_here

  VITE_GUARDIAN_BASE_URL=https://content.guardianapis.com
  VITE_GUARDIAN_API_KEY=your_guardian_key_here

  VITE_NYT_BASE_URL=https://api.nytimes.com/svc/search/v2
  VITE_NYT_API_KEY=your_nytimes_key_here
  ```

---

## Running with Docker (Recommended)

Next step is building the Docker image:
- Run the `docker build -t innoscripta-news .` command in the terminal.

Final step is running the container:
- Run the `docker run -p 8080:80 innoscripta-news` command in the terminal.

Alternatively, you can start the container using Docker Compose:
```bash
docker compose up -d --build
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
