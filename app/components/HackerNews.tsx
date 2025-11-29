import { useAsyncValue } from "react-router";
import type { NewsItem } from "~/api/hackernews";
import AsyncPanel from "./AsyncPanel";
import ElapsedTime from "./ElapsedTime";
import Notice from "./Notice";

type HackerNewsProps = {
  promise: Promise<unknown>;
  url: string;
};

export default function HackerNews({ promise, url }: HackerNewsProps) {
  const link = new URL("https://hn.algolia.com/");
  link.searchParams.set("sort", "byDate");
  link.searchParams.set("type", "story");
  link.searchParams.set("query", url);

  return (
    <AsyncPanel
      defaultTitle="Hacker News"
      link={{ url: link.toString(), text: "Hacker News を見る" }}
      promise={promise}
    >
      <HackerNewsView />
    </AsyncPanel>
  );
}

function HackerNewsView() {
  const news = useAsyncValue() as NewsItem[];

  if (news.length === 0) {
    return <Notice>記事はありません</Notice>;
  }

  return (
    <ul className="space-y-4">
      {news.map((story) =>
        story.kind === "story" ? (
          <li key={story.url} className="space-y-2">
            <div>
              <a href={story.url} className="text-blue-500 hover:underline">
                {story.title}
              </a>
              <br />
              <span className="text-gray-500 text-sm ml-4">
                <span>{story.points} pt</span>
                <span> | </span>
                <span>{story.comments} comments</span>
                <span> | </span>
                <ElapsedTime
                  date={story.created_at.toUTCString()}
                  locale="ja"
                />
              </span>
            </div>
          </li>
        ) : null,
      )}
    </ul>
  );
}
