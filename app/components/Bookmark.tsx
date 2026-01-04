import type { BookmarkResult } from "~/viewer/bookmark/api";
import Comment from "~/viewer/bookmark/Comment";
import { createEntryPageUrl } from "~/viewer/bookmark/utils";
import type { ResultPromise } from "~/viewer/types";
import Notice from "./Notice";
import Panel from "./Panel";

type BookmarkProps = {
  promise: ResultPromise<BookmarkResult>;
  url: string;
};

export default function Bookmark({ promise, url }: BookmarkProps) {
  return (
    <Panel
      defaultTitle="はてなブックマーク"
      link={{ url: createEntryPageUrl(url), text: "はてなブックマークを見る" }}
      promise={promise}
    >
      {(value) => <BookmarkView value={value} />}
    </Panel>
  );
}

function BookmarkView({ value: b }: { value: BookmarkResult }) {
  if (b.kind === "empty") {
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
