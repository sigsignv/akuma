import type { SourceResult } from "~/components/Panel";
import { fetchBookmark } from "~/viewer/bookmark/api";
import type { BookmarkEntry } from "~/viewer/bookmark/parse";
import { parseBookmark } from "~/viewer/bookmark/parse";
import type { SearchOptions } from "./types";

class BookmarkError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = "BookmarkError";
  }
}

export async function getBookmark(
  options: SearchOptions,
): Promise<SourceResult<BookmarkEntry>> {
  const beginTime = performance.now();
  const response = await fetchBookmark(options.url, { signal: options.signal });
  console.log({
    kind: "ResponseTime",
    service: "bookmark",
    timeMs: performance.now() - beginTime,
  });

  let entry: BookmarkEntry;
  try {
    entry = await parseBookmarkData(response);
  } catch (ex) {
    if (ex instanceof SyntaxError) {
      throw new BookmarkError("JSON の解析に失敗しました", ex);
    }
    throw ex;
  }

  if (!entry) {
    return {
      value: null,
    };
  }

  const comments = entry.bookmarks.length;
  const title = `はてなブックマーク (${comments} / ${entry.count})`;

  return { title, sourceUrl: entry.entry_url, value: entry };
}

async function parseBookmarkData(response: Response) {
  const json = await response.json();
  return parseBookmark(json);
}
