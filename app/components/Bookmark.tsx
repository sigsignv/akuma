import React from "react";
import { Await, useAsyncValue } from "react-router";
import type { getBookmark } from "~/routes/api.bookmark";
import ElapsedTime from "./ElapsedTime";
import Icon from "./Icon";

type Bookmarks = Awaited<ReturnType<typeof getBookmark>>;

type BookmarkProps = {
  promise: Promise<Bookmarks>;
};

export default function Bookmark({ promise }: BookmarkProps) {
  return (
    <details id="bookmark" className="pt-4 pb-4" open={true}>
      <summary className="text-2xl font-bold cursor-pointer select-none">
        <React.Suspense fallback="はてなブックマーク">
          <Await resolve={promise}>
            <BookmarkTitle />
          </Await>
        </React.Suspense>
      </summary>
      <div>
        <React.Suspense fallback={<li>Loading...</li>}>
          <Await resolve={promise} errorElement={<li>Error</li>}>
            <BookmarkComments />
          </Await>
        </React.Suspense>
      </div>
    </details>
  );
}

function BookmarkTitle() {
  const b = useAsyncValue() as Bookmarks;

  const comments = b.bookmarks.length;
  const total = b.count;

  return (
    <a href={b.entry_url}>
      はてなブックマーク ({comments}/{total})
    </a>
  );
}

function BookmarkComments() {
  const { bookmarks, eid } = useAsyncValue() as Bookmarks;

  if (bookmarks.length === 0) {
    return <span className="text-gray-500">No comments</span>;
  }

  return (
    <ul className="space-y-4">
      {bookmarks.map((c) => (
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
                  href={`https://b.hatena.ne.jp/entry/${eid}/comment/${c.user}`}
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
