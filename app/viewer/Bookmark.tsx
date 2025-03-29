import Comment from "~/components/Comment";
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
      <ul className="space-y-4">
        {bookmark.comments.map((comment) => (
          <li key={comment.link} className="space-y-2">
            <Comment {...comment} />
          </li>
        ))}
      </ul>
    </div>
  );
}
