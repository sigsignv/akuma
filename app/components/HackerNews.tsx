import { useAsyncValue } from "react-router";
import type { NewsItem } from "~/api/hackernews";
import Section from "./Section";

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
    <Section
      title="Hacker News"
      link={link.toString()}
      linkText="Hacker News を見る"
      promise={promise}
    >
      <HackerNewsView />
    </Section>
  );
}

function HackerNewsView() {
  const news = useAsyncValue() as NewsItem[];

  if (news.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <p className="m-4">記事はありません</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {news.map((story) =>
        story.kind === "story" ? (
          <li key={story.url} className="space-y-2">
            <a href={story.url} className="text-blue-500 hover:underline">
              {story.title}
            </a>
            ({story.points} pt | {story.comments} comments)
          </li>
        ) : null,
      )}
    </ul>
  );
}
