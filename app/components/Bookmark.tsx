import { useState } from "react";
import { useAsyncValue } from "react-router";
import type { getBookmark } from "~/routes/api.bookmark";
import ElapsedTime from "./ElapsedTime";
import Icon from "./Icon";
import Section from "./Section";

type Bookmarks = Awaited<ReturnType<typeof getBookmark>>;

type BookmarkProps = {
  promise: Promise<Bookmarks>;
  url: string;
};

export default function Bookmark({ promise, url }: BookmarkProps) {
  const [title, setTitle] = useState("はてなブックマーク");
  const [link, setLink] = useState(generateFallbackUrl(url));

  return (
    <Section title={title} link={link} linkText="はてなブックマークを見る" promise={promise}>
      <BookmarkView setTitle={setTitle} setLink={setLink} />
    </Section>
  );
}

type ViewProps = {
  setTitle: (title: string) => void;
  setLink: (link: string) => void;
};

function BookmarkView({ setTitle, setLink }: ViewProps) {
  const b = useAsyncValue() as Bookmarks | null;

  const comments = b?.bookmarks.length ?? 0;
  const total = b?.count ?? 0;
  setTitle(`はてなブックマーク (${comments} / ${total})`);

  if (b?.entry_url) {
    setLink(b.entry_url);
  }

  if (!b || comments === 0) {
    return (
      <div className="flex justify-center items-center">
        <p className="m-4">コメントはありません</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {b.bookmarks.map((c) => (
        <li key={c.user} className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <a href={`https://b.hatena.ne.jp/${c.user}/`} target="_blank" rel="noreferrer">
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
                    <ElapsedTime date={c.timestamp} locale="ja" />
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
