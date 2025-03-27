import ElapsedTime from "~/components/ElapsedTime";
import Icon from "~/components/Icon";
import type { getBookmark } from "~/routes/api.bookmark";

type BookmarkProps = {
  bookmark?: Awaited<ReturnType<typeof getBookmark>>;
};

export default function Bookmark({ bookmark }: BookmarkProps) {
  if (!bookmark) {
    return <div>no bookmark</div>;
  }

  const allBookmarkCount = bookmark.count;
  const commentedBookmarkCount = bookmark.bookmarks.length;

  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-bold">
        <a href={bookmark.entry_url}>
          はてなブックマーク ({commentedBookmarkCount}/{allBookmarkCount})
        </a>
      </h2>
      <ul className="space-y-4">
        {bookmark.bookmarks.map((value) => (
          <li key={value.user} className="space-y-2">
            <div className="flex items-center gap-1">
              <Icon
                src={`https://cdn.profile-image.st-hatena.com/users/${value.user}/profile.png`}
                alt={value.user}
              />
              <span className="text-sm font-bold">{value.user}</span>
              <span className="text-sm text-gray-600">
                <ElapsedTime date={value.timestamp} locale="ja" />
              </span>
            </div>
            <div className="ml-6">{value.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
