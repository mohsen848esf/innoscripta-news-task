/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_NEWSAPI_BASE_URL?: string;
  readonly VITE_NEWSAPI_API_KEY?: string;
  readonly VITE_GUARDIAN_BASE_URL?: string;
  readonly VITE_GUARDIAN_API_KEY?: string;
  readonly VITE_NYT_BASE_URL?: string;
  readonly VITE_NYT_API_KEY?: string;
}
