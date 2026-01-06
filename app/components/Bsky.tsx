import type { getPost } from "~/api/bsky";
import Post from "~/viewer/bluesky/Post";
import Notice from "./Notice";
import Panel from "./Panel";

type BlueskyProps = {
  promise: ReturnType<typeof getPost>;
  url: string;
};

export default function Bsky({ promise, url }: BlueskyProps) {
  const link = new URL("https://bsky.app/search");
  link.searchParams.set("q", url);

  return (
    <Panel
      defaultTitle="Bluesky"
      link={{ url: link.toString(), text: "bsky.app を見る" }}
      promise={promise}
    >
      {(value) => <BskyView value={value} />}
    </Panel>
  );
}

function BskyView({
  value,
}: {
  value: Awaited<ReturnType<typeof getPost>>["value"];
}) {
  const comments = value.comments;

  if (comments.length === 0) {
    return <Notice>ポストはありません</Notice>;
  }

  return (
    <ul className="divide-y divide-zinc-300 dark:divide-zinc-600">
      {comments.map((c) => (
        <li key={`${c.handle}/${c.rkey}`} className="py-2 px-2">
          <Post {...c} />
        </li>
      ))}
    </ul>
  );
}
