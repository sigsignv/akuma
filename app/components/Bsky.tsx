import type { getPost } from "~/api/bsky";
import ElapsedTime from "~/components/ElapsedTime";
import AvatarLink from "~/viewer/bluesky/AvatarLink";
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
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c.link} className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <AvatarLink handle={c.author.id} avatar={c.author.icon} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold">{c.author.name}</span>
                <span className="text-sm text-gray-600">@{c.author.id}</span>
                <span className="text-sm text-gray-600">・</span>
                <a href={c.link} target="_blank" rel="noreferrer">
                  <span className="text-sm text-gray-600 no-underline hover:underline">
                    <ElapsedTime date={c.createdAt} locale="ja" />
                  </span>
                </a>
              </div>
              <div>{c.content}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
