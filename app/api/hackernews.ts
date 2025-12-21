import { type HackerNewsSearchResult, hnSearch } from "@sigsign/hn-search";
import type { SourceResult } from "~/components/Panel";

export type NewsItem =
  | {
      kind: "story";
      title: string;
      url: string;
      points: number;
      comments: number;
      created_at: Date;
    }
  | { kind: "unknown" };

type GetStoriesOptions = {
  query: string;
};

export async function getStories({
  query,
}: GetStoriesOptions): Promise<SourceResult<NewsItem[]>> {
  let results: HackerNewsSearchResult;

  const beginTime = Date.now();

  try {
    results = await hnSearch({
      query,
      tags: ["story"],
      sort: "date",
    });
  } catch (ex) {
    console.error({ ex });
    return { value: [] };
  }

  console.log({
    kind: "ResponseTime",
    service: "hackernews",
    timeMs: Date.now() - beginTime,
  });

  const items = results.hits.map((item) => {
    if (item.kind !== "story") {
      console.warn("Unexpected item kind:", item.kind);
      return { kind: "unknown" } as const;
    }

    return {
      kind: "story" as const,
      title: item.title,
      url: `https://news.ycombinator.com/item?id=${item.id}`,
      points: item.points,
      comments: item.num_comments,
      created_at: item.created_at,
    };
  });

  return { value: items };
}
