import { useState } from "react";
import { useAsyncValue } from "react-router";
import type { BookmarkEntry } from "~/api/bookmark";
import ElapsedTime from "~/viewer/bookmark/ElapsedTime";
import AsyncPanel from "./AsyncPanel";
import Icon from "./Icon";
import Notice from "./Notice";

type BookmarkProps = {
  promise: Promise<BookmarkEntry>;
  url: string;
};

export default function Bookmark({ promise, url }: BookmarkProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState(generateFallbackUrl(url));

  return (
    <AsyncPanel
      title={title}
      defaultTitle="はてなブックマーク"
      link={{ url: link, text: "はてなブックマークを見る" }}
      promise={promise}
    >
      <BookmarkView setTitle={setTitle} setLink={setLink} />
    </AsyncPanel>
  );
}

type ViewProps = {
  setTitle: (title: string) => void;
  setLink: (link: string) => void;
};

function BookmarkView({ setTitle, setLink }: ViewProps) {
  const b = useAsyncValue() as BookmarkEntry;

  const comments = b?.bookmarks.length ?? 0;
  const total = b?.count ?? 0;
  setTitle(`はてなブックマーク (${comments} / ${total})`);

  if (b?.entry_url) {
    setLink(b.entry_url);
  }

  if (!b || comments === 0) {
    return <Notice>コメントはありません</Notice>;
  }

  return (
    <ul className="space-y-4">
      {b.bookmarks.map((c) => (
        <li key={c.user} className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <a
                href={`https://b.hatena.ne.jp/${c.user}/`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon
                  src={`https://cdn.profile-image.st-hatena.com/users/${c.user}/profile.png`}
                  alt={`${c.user}'s profile icon`}
                />
              </a>
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
