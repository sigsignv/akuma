import { useState } from "react";
import { useAsyncValue } from "react-router";
import ElapsedTime from "~/components/ElapsedTime";
import Icon from "~/components/Icon";
import type { getBskyPost } from "../routes/api.bsky";
import type { Comments } from "./List";
import Section from "./Section";

type BlueskyProps = {
  promise: ReturnType<typeof getBskyPost>;
  url: string;
};

export default function Bsky({ promise, url }: BlueskyProps) {
  const [title, setTitle] = useState("Bluesky");

  const link = new URL("https://bsky.app/search");
  link.searchParams.set("q", url);

  return (
    <Section title={title} link={link.toString()} linkText="bsky.app を見る" promise={promise}>
      <BskyView setTitle={setTitle} />
    </Section>
  );
}

type ViewProps = {
  setTitle: (title: string) => void;
};

function BskyView({ setTitle }: ViewProps) {
  const { comments } = useAsyncValue() as { comments: Comments };

  setTitle(`Bluesky (${comments.length})`);

  if (comments.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <p className="m-4">ポストはありません</p>
      </div>
    );
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
