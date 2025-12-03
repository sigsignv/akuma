import { redirect } from "react-router";
import { getBookmark } from "~/api/bookmark";
import { getPost } from "~/api/bsky";
import { getStories } from "~/api/hackernews";
import { isValidUrl } from "~/utils";
import Viewer from "~/viewer/Viewer";
import type { Route } from "./+types/reactions";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const u = new URL(request.url);
  const url = u.searchParams.get("url");

  if (!isValidUrl(url)) {
    throw redirect("/");
  }

  const signal = AbortSignal.timeout(3000);

  return {
    kind: "content",
    url,
    bookmark: getBookmark({ url, signal }),
    posts: getPost({ url, signal }),
    news: getStories({ query: url }),
  };
}

export default function Reactions({ loaderData }: Route.ComponentProps) {
  const { url, bookmark, posts, news } = loaderData;

  return <Viewer url={url} bookmark={bookmark} posts={posts} news={news} />;
}
