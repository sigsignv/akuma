export type BookmarkEntry = {
  count: number;
  entry_url: string;
  bookmarks: BookmarkComment[];
};

type BookmarkComment = {
  user: string;
  tags: string[];
  timestamp: string;
  comment: string;
};

export async function fetchBookmark(url: string) {
  const u = new URL("https://b.hatena.ne.jp/entry/json/");
  u.searchParams.set("url", url);

  const resp = await fetch(u, {
    headers: {
      "User-Agent": "akuma (Anonymous buKUMA viewer)",
    },
  });
  if (!resp.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  const entry = (await resp.json()) as BookmarkEntry;
  console.log({ entry });
  const c = entry.bookmarks.length;
  console.log({ count: c });
  return entry;
}

type BookmarkProps = {
  entry?: BookmarkEntry;
};

export default function Bookmark({ entry }: BookmarkProps) {
  if (!entry) {
    return <div>hoge</div>;
  }

  return (
    <main className="pt-16 pb-4">
      <h2 className="text-2xl font-bold">はてなブックマーク</h2>
      <ul className="list-disc ml-8">
        {entry.bookmarks.map((bookmark) => (
          <li key={bookmark.user}>
            <div className="text-lg font-bold">{bookmark.user}</div>
            <div className="text-sm text-gray-600">{bookmark.timestamp}</div>
            <div className="text-sm text-gray-600">{bookmark.tags.join(", ")}</div>
            <div>{bookmark.comment}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
