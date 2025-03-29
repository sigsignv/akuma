import List from "~/components/List";
import type { getBookmark } from "~/routes/api.bookmark";

type BookmarkProps = {
  bookmark?: Awaited<ReturnType<typeof getBookmark>>;
};

export default function Bookmark({ bookmark }: BookmarkProps) {
  if (!bookmark) {
    return <div>no bookmark</div>;
  }

  const allBookmarkCount = bookmark.total;
  const commentedBookmarkCount = bookmark.comments.length;

  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-bold">
        <a href={bookmark.url}>
          はてなブックマーク ({commentedBookmarkCount}/{allBookmarkCount})
        </a>
      </h2>
      {bookmark && <List {...bookmark} />}
    </div>
  );
}
