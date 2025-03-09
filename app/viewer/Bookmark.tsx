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

  return (
    <div className="pt-16 pb-4">
      <h2 className="text-2xl font-bold">
        <a href={bookmark.entry_url}>はてなブックマーク ({bookmark.count})</a>
      </h2>
      <ul className="ml-8">
        {bookmark.bookmarks.map((value) => (
          <li key={value.user}>
            <img
              src={`https://cdn.profile-image.st-hatena.com/users/${value.user}/profile.png`}
              alt={value.user}
              className="w-8 h-8 inline-block"
              decoding="async"
            />
            <div className="text-lg font-bold">{value.user}</div>
            <div className="text-sm text-gray-600">{value.timestamp}</div>
            <div>{value.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
