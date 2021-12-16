// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_PATH: string;
    SECRET_KEY: string;
    THROTTLER_TTL: string;
    THROTTLER_LIMIT: string;
    MAX_COMPLEXITY: string;
    MAX_DEPTH: string;
    DEBUG: string;
  }
}
