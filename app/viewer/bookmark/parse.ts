import * as v from "valibot";

const bookmarkComment = v.object({
  user: v.pipe(v.string(), v.examples(["user_123"])),
  comment: v.pipe(v.string(), v.examples(["This is a bookmark comment."])),
  timestamp: v.pipe(v.string(), v.examples(["2020/01/02 03:04"])),
});

const bookmarkEntry = v.nullable(
  v.object({
    count: v.pipe(v.number(), v.integer(), v.minValue(0), v.examples([5])),
    eid: v.pipe(v.string(), v.decimal(), v.examples(["123456789"])),
    entry_url: v.pipe(
      v.string(),
      v.url(),
      v.examples(["https://b.hatena.ne.jp/entry/s/www.hatena.ne.jp/"]),
    ),
    bookmarks: v.array(bookmarkComment),
  }),
);

export type BookmarkResponse = v.InferInput<typeof bookmarkEntry>;

/**
 * Parse bookmark data from Hatena Bookmark API response.
 */
export function parseBookmark(data: unknown): BookmarkResponse {
  const entry = v.parse(bookmarkEntry, data);

  if (!entry) {
    return entry;
  }

  // Filter empty comments
  const bookmarks = entry.bookmarks.filter((c) => c.comment !== "");

  return { ...entry, bookmarks };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("parseBookmark", () => {
    it("should parse valid data", () => {
      const data = {
        count: 2,
        eid: "123456789",
        entry_url: "https://b.hatena.ne.jp/entry/s/www.hatena.ne.jp/",
        bookmarks: [
          {
            user: "user_1",
            comment: "This is a comment.",
            timestamp: "2020/01/02 03:04",
          },
          {
            user: "user_2",
            comment: "",
            timestamp: "2020/01/02 04:05",
          },
        ],
      };

      const result = parseBookmark(data);
      expect(result).toEqual({
        count: 2,
        eid: "123456789",
        entry_url: "https://b.hatena.ne.jp/entry/s/www.hatena.ne.jp/",
        bookmarks: [
          {
            user: "user_1",
            comment: "This is a comment.",
            timestamp: "2020/01/02 03:04",
          },
        ],
      });
    });

    it("should return null for null input", () => {
      const result = parseBookmark(null);
      expect(result).toBeNull();
    });

    it("should throw error for invalid data", () => {
      const data = {
        count: -1,
        eid: "abc",
        entry_url: "invalid-url",
        bookmarks: [],
      };
      expect(() => parseBookmark(data)).toThrow();
    });
  });
}
