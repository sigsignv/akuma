export type SearchOptions = {
  url: string;
  signal?: AbortSignal;
  client?: typeof fetch;
};
