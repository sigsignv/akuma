import * as v from "valibot";
import type { SourceResult } from "~/components/Panel";
import { fetchBookmark } from "~/viewer/bookmark";
import type { SearchOptions } from "./types";

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
    bookmarks: v.array(bookmarkComment),
  }),
);

export type BookmarkEntry = v.InferOutput<typeof bookmarkEntry>;

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

async function parseBookmarkData(response: Response): Promise<BookmarkEntry> {
  const json = await response.json();
  let entry = v.parse(bookmarkEntry, json);

  if (entry) {
    entry = {
      ...entry,
      bookmarks: entry.bookmarks.filter((b) => b.comment !== ""),
    };
  }

  return entry;
}
