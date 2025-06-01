import type { getBskyPost } from "../routes/api.bsky";
import List from "./List";

type BlueskyProps = {
  promise: ReturnType<typeof getBskyPost>;
};

export default function Bsky({ promise }: BlueskyProps) {
  return (
    <details id="bluesky" className="pt-4 pb-4" open={true}>
      <summary className="text-2xl font-bold cursor-pointer select-none">Bluesky</summary>
      <div className="flex justify-center items-center">
        <List promise={promise} />
      </div>
    </details>
  );
}
