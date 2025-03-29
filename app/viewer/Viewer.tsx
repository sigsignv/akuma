import Bluesky from "./Bluesky";
import Bookmark from "./Bookmark";

type ViewerProps = {
  bookmark?: React.ComponentProps<typeof Bookmark>["bookmark"];
  result?: React.ComponentProps<typeof Bluesky>["result"];
};

export function Viewer({ bookmark, result }: ViewerProps) {
  return (
    <>
      <Bookmark bookmark={bookmark} />
      <Bluesky result={result} />
    </>
  );
}
