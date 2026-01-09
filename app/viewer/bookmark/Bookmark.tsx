import Notice from "~/components/Notice";
import Panel from "~/components/Panel";
import type { PanelChildrenProps } from "../types";
import type { BookmarkResult } from "./api";
import Comment from "./Comment";
import { createEntryPageUrl } from "./utils";

export default function Bookmark({
  url,
  promise,
}: PanelChildrenProps<BookmarkResult>) {
  const children = (r: BookmarkResult) => {
    if (r.kind === "empty") {
      return <Notice>コメントはありません</Notice>;
    }
    return (
      <ul className="divide-y divide-zinc-300 dark:divide-zinc-600">
        {r.bookmarks.map((c) => (
          <li key={c.user} className="py-2 px-2">
            <Comment eid={r.eid} {...c} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Panel
      defaultTitle="はてなブックマーク"
      link={{ url: createEntryPageUrl(url), text: "はてなブックマークを見る" }}
      promise={promise}
    >
      {(value) => children(value)}
    </Panel>
  );
}
