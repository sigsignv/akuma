export type QueryOptions = {
  url: string;
  signal?: AbortSignal;
};

export type ResultPromise<T> = Promise<{
  title: string;
  value: T;
  sourceUrl: string;
}>;
