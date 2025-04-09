import { parse } from "date-fns";
import { data } from "react-router";
import { fetchBookmark, parseBookmark } from "~/api/bookmark";
import type { Comments, ListProps } from "~/components/List";
import { isValidUrl } from "~/utils";
import type { Route } from "./+types/api.bookmark";

type Bookmark = ListProps & {
  url: string;
  total: number;
};

type GetBookmarkOptions = {
  url: string;
  signal?: AbortSignal;
};

export async function getBookmark({ url, signal }: GetBookmarkOptions): Promise<Bookmark> {
  const resp = await fetchBookmark({ url, signal });
  if (!resp.ok) {
    throw new Error("Oops! Something wrong with the bookmark fetch. Please try again later.");
  }

  const entry = await parseBookmark(resp);
  if (!entry) {
    const encodedUrl = url.replaceAll(/#/g, "%23");
    return {
      url: `https://b.hatena.ne.jp/entry/${encodedUrl}`,
      total: 0,
      comments: [],
    };
  }

  const comments: Comments = entry.bookmarks.map((bookmark) => {
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
