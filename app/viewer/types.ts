export type QueryOptions = {
  url: string;
  signal?: AbortSignal;
};

export type ResultPromise<T> = Promise<{
  title: string;
  value: T;
  sourceUrl: string;
}>;

export type PanelChildrenProps<T> = {
  url: string;
  promise: ResultPromise<T>;
};
