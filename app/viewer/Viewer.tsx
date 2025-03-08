import Bookmark from "./Bookmark";
import type { BookmarkEntry } from "./Bookmark";

type ViewerProps = {
  bookmark?: BookmarkEntry;
};

export function Viewer({ bookmark }: ViewerProps) {
  return <Bookmark entry={bookmark} />;
}
