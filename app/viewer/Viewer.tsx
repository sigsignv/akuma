import Bluesky from "./Bluesky";
import Bookmark from "./Bookmark";

type ViewerProps = {
  bookmark?: React.ComponentProps<typeof Bookmark>["bookmark"];
  posts?: React.ComponentProps<typeof Bluesky>["posts"];
};

export function Viewer({ bookmark, posts }: ViewerProps) {
  return (
    <>
      <Bookmark bookmark={bookmark} />
      <Bluesky posts={posts} />
    </>
  );
}
