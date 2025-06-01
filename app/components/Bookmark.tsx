import React from "react";
import { Await, useAsyncError, useAsyncValue } from "react-router";
import type { getBookmark } from "~/routes/api.bookmark";
import ElapsedTime from "./ElapsedTime";
import Icon from "./Icon";

type Bookmarks = Awaited<ReturnType<typeof getBookmark>>;

type BookmarkProps = {
  promise: Promise<Bookmarks>;
  url: string;
};

export default function Bookmark({ promise, url }: BookmarkProps) {
  const props: BaseProps = {
    fallbackUrl: generateFallbackUrl(url),
  };

  return (
    <React.Suspense fallback={<BookmarkSkeleton {...props} />}>
      <Await resolve={promise} errorElement={<BookmarkError {...props} />}>
        <BookmarkComments {...props} />
      </Await>
    </React.Suspense>
  );
}

type BaseProps = {
  fallbackUrl: string;
};

type ViewProps = BaseProps & {
  title?: string;
  link?: string;
  children: React.ReactNode;
};

function BookmarkView({ title, link, children, fallbackUrl }: ViewProps) {
  return (
    <details className="pt-4 pb-4" open={true}>
      <summary className="text-2xl font-bold cursor-pointer select-none">
        {title ? title : "はてなブックマーク"}
      </summary>
      <div>{children}</div>
      <div className="flex justify-center pt-4">
        <a href={link ? link : fallbackUrl} target="_blank" rel="noreferrer">
          <span className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
            はてなブックマークを見る
          </span>
        </a>
      </div>
    </details>
  );
}

function BookmarkSkeleton(props: BaseProps) {
  return (
    <BookmarkView {...props}>
      <div className="flex justify-center items-center">
        <p className="m-4">Loading...</p>
      </div>
    </BookmarkView>
  );
}

function BookmarkError(props: BaseProps) {
  const error = useAsyncError() as Error;

  return (
    <BookmarkView {...props}>
      <div className="flex justify-center items-center">
        <p className="m-4">{error.message}</p>
      </div>
    </BookmarkView>
  );
}

function BookmarkComments({ fallbackUrl }: BaseProps) {
  const bookmarks = useAsyncValue() as Bookmarks;

  const b = bookmarks ?? {
    entry_url: fallbackUrl,
    count: 0,
    bookmarks: [],
    eid: "0",
  };

  const props = {
    fallbackUrl,
    title: `はてなブックマーク (${b.bookmarks.length} / ${b.count})`,
    link: b.entry_url,
  };

  return (
    <BookmarkView {...props}>
      {b.bookmarks.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="m-4">コメントはありません</p>
        </div>
      ) : (
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
      )}
    </BookmarkView>
  );
}

function generateFallbackUrl(url: string): string {
  const escapedUrl = url.replaceAll(/#/g, "%23");
  return `https://b.hatena.ne.jp/entry/${escapedUrl}`;
}
