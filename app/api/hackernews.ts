import { type HackerNewsSearchResult, type HackerNewsStory, hnSearch } from "@sigsign/hn-search";

export type NewsItem =
  | {
      kind: "story";
      title: string;
      url: string;
      points: number;
      comments: number;
      updated_at: Date;
    }
  | { kind: "unknown" };

type GetStoriesOptions = {
  query: string;
};

export async function getStories({ query }: GetStoriesOptions): Promise<NewsItem[]> {
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
    return [];
  }

  console.log({ kind: "ResponseTime", service: "hackernews", timeMs: Date.now() - beginTime });

  return results.hits.map((item) => {
    if (item.kind !== "story") {
      console.warn("Unexpected item kind:", item.kind);
      return { kind: "unknown" };
    }

    return {
      kind: "story",
      title: item.title,
      url: `https://news.ycombinator.com/item?id=${item.id}`,
      points: item.points,
      comments: item.num_comments,
      updated_at: item.updated_at,
    };
  });
}
