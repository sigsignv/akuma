import { z } from "zod";

const BookmarkComment = z.object({
  user: z.string(),
  tags: z.string().array(),
  timestamp: z.string(),
  comment: z.string(),
});

const BookmarkEntry = z.nullable(
  z.object({
    count: z.number(),
    entry_url: z.string(),
    bookmarks: z.array(BookmarkComment),
  }),
);

type BookmarkEntry = NonNullable<z.infer<typeof BookmarkEntry>>;

export async function fetchBookmark(url: string): Promise<BookmarkEntry> {
  // ref: https://developer.hatena.ne.jp/ja/documents/bookmark/apis/getinfo/
  const u = new URL("https://b.hatena.ne.jp/entry/json/");
  u.searchParams.set("url", url);

  const resp = await fetch(u, {
    headers: {
      "User-Agent": "akuma (Anonymous buKUMA viewer)",
    },
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch bookmark");
  }

  const json = await resp.json();
  const bookmark = BookmarkEntry.parse(json);

  if (!bookmark) {
    const encodedUrl = url.replaceAll(/#/g, "%23");
    return {
      count: 0,
      entry_url: `https://b.hatena.ne.jp/entry/${encodedUrl}`,
      bookmarks: [],
    };
  }

  // Remove bookmarks with no comment
  bookmark.bookmarks = bookmark.bookmarks.filter((value) => value.comment !== "");

  return bookmark;
}

type BookmarkProps = {
  bookmark?: BookmarkEntry;
};

export default function Bookmark({ bookmark }: BookmarkProps) {
  if (!bookmark) {
    return <div>no bookmark</div>;
  }

  const allBookmarkCount = bookmark.count;
  const commentedBookmarkCount = bookmark.bookmarks.length;

  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-bold">
        <a href={bookmark.entry_url}>
          はてなブックマーク ({commentedBookmarkCount}/{allBookmarkCount})
        </a>
      </h2>
      <ul className="space-y-4">
        {bookmark.bookmarks.map((value) => (
          <li key={value.user} className="space-y-2">
            <div className="flex items-center gap-1">
              <img
                src={`https://cdn.profile-image.st-hatena.com/users/${value.user}/profile.png`}
                alt={value.user}
                decoding="async"
                width={24}
                height={24}
              />
              <span className="text-sm font-bold">{value.user}</span>
              <span className="text-sm text-gray-600">{value.timestamp}</span>
            </div>
            <div className="ml-6">{value.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
