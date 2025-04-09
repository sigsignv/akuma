type GetBookmarkOptions = {
  url: string;
  signal?: AbortSignal;
};

export function fetchBookmark({ url, signal }: GetBookmarkOptions): Promise<Response> {
  // ref: https://developer.hatena.ne.jp/ja/documents/bookmark/apis/getinfo/
  const api = new URL("https://b.hatena.ne.jp/entry/jsonlite/");
  api.searchParams.set("url", url);

  const headers = new Headers({
    "User-Agent": "akuma (Awesome buKUMA viewer)",
  });

  return fetch(api, { headers, signal });
}
