import { useState } from "react";
import { useAsyncValue } from "react-router";
import ElapsedTime from "~/components/ElapsedTime";
import Icon from "~/components/Icon";
import type { getBskyPost } from "../routes/api.bsky";
import AsyncPanel from "./AsyncPanel";
import type { Comments } from "./List";
import Notice from "./Notice";

type BlueskyProps = {
  promise: ReturnType<typeof getBskyPost>;
  url: string;
};

export default function Bsky({ promise, url }: BlueskyProps) {
  const [title, setTitle] = useState("Bluesky");

  const link = new URL("https://bsky.app/search");
  link.searchParams.set("q", url);

  return (
    <AsyncPanel
      title={title}
      link={{ url: link.toString(), text: "bsky.app を見る" }}
      promise={promise}
    >
      <BskyView setTitle={setTitle} />
    </AsyncPanel>
  );
}

type ViewProps = {
  setTitle: (title: string) => void;
};

function BskyView({ setTitle }: ViewProps) {
  const { comments } = useAsyncValue() as { comments: Comments };

  setTitle(`Bluesky (${comments.length})`);

  if (comments.length === 0) {
    return <Notice>ポストはありません</Notice>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c.link} className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <a href={c.author.link} target="_blank" rel="noreferrer">
                <Icon src={c.author.icon} alt={`${c.author.name}'s profile icon`} />
              </a>
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
