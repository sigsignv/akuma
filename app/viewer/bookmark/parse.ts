import * as v from "valibot";

const bookmarkComment = v.object({
  user: v.pipe(v.string(), v.examples(["user_123"])),
  comment: v.pipe(v.string(), v.examples(["This is a bookmark comment."])),
  timestamp: v.pipe(v.string(), v.examples(["2020/01/02 03:04"])),
});

const bookmarkEntry = v.object({
  count: v.pipe(v.number(), v.integer(), v.minValue(0), v.examples([5])),
  eid: v.pipe(v.string(), v.decimal(), v.examples(["123456789"])),
  entry_url: v.pipe(
    v.string(),
    v.url(),
    v.examples(["https://b.hatena.ne.jp/entry/s/www.hatena.ne.jp/"]),
  ),
  bookmarks: v.array(bookmarkComment),
});

const bookmarkSchema = v.nullable(bookmarkEntry);

export type BookmarkEntry = v.InferOutput<typeof bookmarkSchema>;

export function parseBookmark(data: unknown) {
  const entry = v.parse(bookmarkSchema, data);

  if (!entry) {
    return entry;
  }

  // Filter emtry comments
  const bookmarks = entry.bookmarks.filter((c) => c.comment !== "");

  return { ...entry, bookmarks };
}
