import Comment from "~/viewer/bookmark/Comment";
import type { BookmarkEntry } from "~/viewer/bookmark/parse";
import Notice from "./Notice";
import Panel, { type SourceResult } from "./Panel";

type BookmarkProps = {
  promise: Promise<SourceResult<BookmarkEntry>>;
  url: string;
};

export default function Bookmark({ promise, url }: BookmarkProps) {
  return (
    <Panel
      defaultTitle="はてなブックマーク"
      link={{ url: generateFallbackUrl(url), text: "はてなブックマークを見る" }}
      promise={promise}
    >
      {(value) => <BookmarkView value={value} />}
    </Panel>
  );
}

function BookmarkView({ value: b }: { value: BookmarkEntry }) {
  if (!b || b?.bookmarks.length === 0) {
    return <Notice>コメントはありません</Notice>;
  }

  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
      {b.bookmarks.map((c) => (
        <li key={c.user} className="py-2">
          <Comment eid={b.eid} {...c} />
        </li>
      ))}
    </ul>
  );
}

function generateFallbackUrl(url: string): string {
  const escapedUrl = url.replaceAll(/#/g, "%23");
  return `https://b.hatena.ne.jp/entry/${escapedUrl}`;
}
