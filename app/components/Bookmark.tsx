import React from "react";
import { Await, useAsyncValue } from "react-router";
import type { getBookmark } from "~/routes/api.bookmark";
import List from "./List";

type Bookmarks = Awaited<ReturnType<typeof getBookmark>>;

type BookmarkProps = {
  promise: Promise<Bookmarks>;
};

export default function Bookmark({ promise }: BookmarkProps) {
  return (
    <div id="bookmark" className="pt-4 pb-4">
      <h2 className="text-2xl font-bold">
        <React.Suspense fallback="はてなブックマーク">
          <Await resolve={promise}>
            <BookmarkTitle />
          </Await>
        </React.Suspense>
      </h2>
      <List promise={promise} />
    </div>
  );
}

function BookmarkTitle() {
  const b = useAsyncValue() as Bookmarks;

  const comments = b.comments.length;
  const total = b.total;

  return (
    <a href={b.url}>
      はてなブックマーク ({comments}/{total})
    </a>
  );
}
