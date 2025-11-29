import { redirect } from "react-router";
import { getBookmark } from "~/api/bookmark";
import { getPost } from "~/api/bsky";
import { getStories } from "~/api/hackernews";
import Bookmark from "~/components/Bookmark";
import Bsky from "~/components/Bsky";
import HackerNews from "~/components/HackerNews";
import LocationBar from "~/components/LocationBar";
import { isValidUrl } from "~/utils";
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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Akuma</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-xl p-4">
        <LocationBar url={url} />
        <div className="py-4">
          <div className="bookmark">
            <Bookmark promise={bookmark} url={url} />
          </div>
          <div className="bsky">
            <Bsky promise={posts} url={url} />
          </div>
          <div className="hackernews">
            <HackerNews promise={news} url={url} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <p>
            <a href="https://github.com/sigsignv/akuma">Source</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
