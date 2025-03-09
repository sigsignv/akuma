import Bookmark from "./Bookmark";

type ViewerProps = {
  bookmark?: React.ComponentProps<typeof Bookmark>["bookmark"];
};

export function Viewer({ bookmark }: ViewerProps) {
  return <Bookmark bookmark={bookmark} />;
}
