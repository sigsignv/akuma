import Comment from "~/components/Comment";
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
            <Comment
              author={{
                id: value.user,
                icon: `https://cdn.profile-image.st-hatena.com/users/${value.user}/profile.png`,
                link: `https://b.hatena.ne.jp/${value.user}/`,
              }}
              createdAt={value.timestamp}
              content={value.comment}
              link={bookmark.entry_url}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
