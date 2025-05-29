import React from "react";
import { Await, redirect } from "react-router";
import { getStories } from "~/api/hackernews";
import Bookmark from "~/components/Bookmark";
import List from "~/components/List";
import LocationBar from "~/components/LocationBar";
import { isValidUrl } from "~/utils";
import type { Route } from "./+types/reactions";
import { getBookmark } from "./api.bookmark";
import { getBskyPost } from "./api.bsky";

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

  return {
    kind: "content",
    url,
    bookmark: getBookmark({ url }),
    posts: getBskyPost({ url }),
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

      <main className="flex-grow container mx-auto p-4">
        <LocationBar url={url} />
        <div className="py-4">
          <Bookmark promise={bookmark} />
          <div className="pt-4 pb-4">
            <h2 className="text-2xl font-bold">Bluesky</h2>
            <List promise={posts} />
          </div>
          <div className="pt-4 pb-4">
            <h2 className="text-2xl font-bold">Hacker News</h2>
            <React.Suspense fallback="Loading...">
              <Await resolve={news} errorElement={<p>Error</p>}>
                {(news) => (
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
                )}
              </Await>
            </React.Suspense>
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
