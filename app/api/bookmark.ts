import * as v from "valibot";

const bookmarkComment = v.object({
  user: v.string(),
  timestamp: v.string(),
  comment: v.string(),
});

const bookmarkEntry = v.nullable(
  v.object({
    count: v.pipe(v.number(), v.integer(), v.minValue(0)),
    entry_url: v.pipe(v.string(), v.url()),
    eid: v.pipe(v.string(), v.decimal()),
    bookmarks: v.pipe(
      v.array(bookmarkComment),
      v.transform((arr) => arr.filter((bookmark) => bookmark.comment !== "")),
    ),
  }),
);

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

export async function parseBookmark(response: Response) {
  try {
    const json = await response.json();
    return v.parse(bookmarkEntry, json);
  } catch (ex) {
    if (ex instanceof SyntaxError) {
      console.log({ kind: "JSON.parse", error: ex });
      throw new Error("Invalid JSON response");
    }
    if (ex instanceof v.ValiError) {
      console.log({ kind: "valibot", error: ex });
      throw new Error("Invalid JSON response");
    }
    throw new Error("Unknown error");
  }
}

/**
 * Hatena Bookmark Entry API returns '500 Internal Server Error' when the request takes too long.
 * This function estimates if the request has likely timed out based on elapsed time.
 */
function isProbablyTimeout(beginTime: number): boolean {
  return Date.now() - beginTime > 5 * 1000;
}
