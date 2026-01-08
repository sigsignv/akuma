import { redirect } from "react-router";
import { getPost } from "~/api/bsky";
import { getStories } from "~/api/hackernews";
import { getBookmark } from "~/viewer/bookmark/api";
import Viewer from "~/viewer/Viewer";
import type { Route } from "./+types/peek";

export function loader({ request }: Route.LoaderArgs) {
  const url = extractUrl(request);

  const signal = AbortSignal.timeout(3000);

  return {
    url,
    bookmark: getBookmark({ url, signal }),
    posts: getPost({ url, signal }),
    news: getStories({ query: url }),
  };
}

export default function Peek({ loaderData }: Route.ComponentProps) {
  const { url, bookmark, posts, news } = loaderData;

  return (
    <div>
      <title>Peek - Akuma</title>
      <Viewer url={url} bookmark={bookmark} posts={posts} news={news} />
    </div>
  );
}

function extractUrl(request: Request) {
  const u = new URL(request.url);

  const url = u.searchParams.get("url");
  if (url && URL.canParse(url) && isAbsoluteUrl(url)) {
    return url;
  }

  /**
   * Handling for Android's Web Share Target API
   * When url parameter is empty, the URL is included in the text parameter
   */
  const text = u.searchParams.get("text");
  if (text) {
    const regexp = /(?:^|\s+)(?<url>https?:\/\/[^\s]+)$/u;
    const url = text.match(regexp)?.groups?.url;
    if (url && URL.canParse(url)) {
      return url;
    }
  }

  throw redirect("/");
}

function isAbsoluteUrl(url: string) {
  return url.startsWith("https://") || url.startsWith("http://");
}
