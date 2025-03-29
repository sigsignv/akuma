import Comment from "~/components/Comment";
import type { getBskyPost } from "~/routes/api.bsky";

type BlueskyProps = {
  result?: Awaited<ReturnType<typeof getBskyPost>>;
};

export default function Bluesky({ result }: BlueskyProps) {
  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-bold">Bluesky</h2>
      <ul className="space-y-4">
        {result?.comments.map((comment) => (
          <li key={comment.link} className="space-y-2">
            <Comment {...comment} />
          </li>
        ))}
      </ul>
    </div>
  );
}
