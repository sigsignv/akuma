import { data } from "react-router";
import { type Bookmarks, fetchBookmark, parseBookmark } from "~/api/bookmark";
import { isValidUrl } from "~/utils";
import type { Route } from "./+types/api.bookmark";

type Bookmark = NonNullable<Bookmarks>;

type GetBookmarkOptions = {
  url: string;
  signal?: AbortSignal;
};

export async function getBookmark({ url, signal }: GetBookmarkOptions): Promise<Bookmark> {
  const beginTime = Date.now();
  const resp = await fetchBookmark({ url, signal });
  if (!resp.ok) {
    throw new Error("Oops! Something wrong with the bookmark fetch. Please try again later.");
  }

  const entry = await parseBookmark(resp);
  if (!entry) {
    const encodedUrl = url.replaceAll(/#/g, "%23");
    return {
      entry_url: `https://b.hatena.ne.jp/entry/${encodedUrl}`,
      count: 0,
      bookmarks: [],
      eid: "0",
    };
  }

  console.log({ kind: "ResponseTime", service: "bookmark", timeMs: Date.now() - beginTime });

  return entry;
}

export async function loader({ request }: Route.LoaderArgs) {
  const u = new URL(request.url);
  const url = u.searchParams.get("url");

  if (!isValidUrl(url)) {
    return data({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const signal = AbortSignal.timeout(5000);
    return await getBookmark({ url, signal });
  } catch (err) {
    // from AbortSignal
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return data({ error: "Request timeout" }, { status: 504 });
    }
    // from getBookmark()
    if (err instanceof Error && err.message === "TimeoutError") {
      return data({ error: "Request timeout" }, { status: 504 });
    }

    console.log({ err });
    return data({ error: "Internal Server Error" }, { status: 500 });
  }
}
