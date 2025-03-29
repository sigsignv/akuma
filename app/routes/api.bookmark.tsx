import { parse } from "date-fns";
import { data } from "react-router";
import { z } from "zod";
import type { Comments, ListProps } from "~/components/List";
import { isValidUrl } from "~/utils";
import type { Route } from "./+types/api.bookmark";

type Bookmark = ListProps & {
  url: string;
  total: number;
};

const bookmarkComment = z.object({
  user: z.string(),
  tags: z.string().array(),
  timestamp: z.string(),
  comment: z.string(),
});

const bookmarkEntry = z.nullable(
  z.object({
    count: z.number(),
    entry_url: z.string(),
    eid: z.string(),
    bookmarks: z.array(bookmarkComment),
  }),
);

type GetBookmarkOptions = {
  url: string;
  signal?: AbortSignal;
};

export async function getBookmark({ url, signal }: GetBookmarkOptions): Promise<Bookmark> {
  const resp = await fetchBookmark({ url, signal });
  if (resp.status === 500) {
    throw new Error("TimeoutError");
  }
  if (!resp.ok) {
    throw new Error("Oops! Something wrong with the bookmark fetch. Please try again later.");
  }

  const json = await resp.json();
  const entry = bookmarkEntry.parse(json);
  if (!entry) {
    const encodedUrl = url.replaceAll(/#/g, "%23");
    return {
      url: `https://b.hatena.ne.jp/entry/${encodedUrl}`,
      total: 0,
      comments: [],
    };
  }

  const comments: Comments = entry.bookmarks
    .filter((bookmark) => bookmark.comment !== "")
    .map((bookmark) => {
      return {
        author: {
          id: bookmark.user,
          icon: `https://cdn.profile-image.st-hatena.com/users/${bookmark.user}/profile.png`,
          link: `https://b.hatena.ne.jp/${bookmark.user}/`,
        },
        content: bookmark.comment,
        createdAt: convertDate(bookmark.timestamp),
        link: `https://b.hatena.ne.jp/entry/${entry.eid}/comment/${bookmark.user}`,
      };
    });

  return {
    url: entry.entry_url,
    total: entry.count,
    comments,
  };
}

function fetchBookmark({ url, signal }: GetBookmarkOptions): Promise<Response> {
  // ref: https://developer.hatena.ne.jp/ja/documents/bookmark/apis/getinfo/
  const api = new URL("https://b.hatena.ne.jp/entry/jsonlite/");
  api.searchParams.set("url", url);

  const headers = new Headers({
    "User-Agent": "akuma (Awesome buKUMA viewer)",
  });

  return fetch(api, { headers, signal });
}

function convertDate(timestamp: string): string {
  const date = parse(`${timestamp} +09:00`, "yyyy/MM/dd HH:mm XXX", new Date());
  return date.toISOString();
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
