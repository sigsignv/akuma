type GetBookmarkOptions = {
  url: string;
  signal?: AbortSignal;
};

export async function fetchBookmark({ url, signal }: GetBookmarkOptions): Promise<Response> {
  // ref: https://developer.hatena.ne.jp/ja/documents/bookmark/apis/getinfo/
  const api = new URL("https://b.hatena.ne.jp/entry/jsonlite/");
  api.searchParams.set("url", url);

  const headers = new Headers({
    "User-Agent": "akuma (Awesome buKUMA viewer)",
  });

  const beginTime = Date.now();
  const resp = await fetch(api, { headers, signal });

  if (resp.status === 500 && isProbablyTimeout(beginTime)) {
    throw new Error("TimeoutError");
  }

  return resp;
}

/**
 * Hatena Bookmark Entry API returns '500 Internal Server Error' when the request takes too long.
 * This function estimates if the request has likely timed out based on elapsed time.
 */
function isProbablyTimeout(beginTime: number): boolean {
  return Date.now() - beginTime > 5 * 1000;
}
