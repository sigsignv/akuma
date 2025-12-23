import type { BookmarkEntry } from "~/api/bookmark";
import AvatarLink from "~/viewer/bookmark/AvatarLink";
import ElapsedTime from "~/viewer/bookmark/ElapsedTime";
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
    <ul className="space-y-4">
      {b.bookmarks.map((c) => (
        <li key={c.user} className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <AvatarLink user={c.user} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold">{c.user}</span>
                <span className="text-sm text-gray-600">・</span>
                <a
                  href={`https://b.hatena.ne.jp/entry/${b.eid}/comment/${c.user}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="text-sm text-gray-600 no-underline hover:underline">
                    <ElapsedTime timestamp={c.timestamp} />
                  </span>
                </a>
              </div>
              <div>{c.comment}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function generateFallbackUrl(url: string): string {
  const escapedUrl = url.replaceAll(/#/g, "%23");
  return `https://b.hatena.ne.jp/entry/${escapedUrl}`;
}
