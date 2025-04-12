import React from "react";
import { Await } from "react-router";
import List from "~/components/List";
import LocationBar from "~/components/LocationBar";
import Welcome from "~/components/Welcome";
import { isValidUrl } from "~/utils";
import type { Route } from "./+types/_index";
import { getBookmark } from "./api.bookmark";
import { getBskyPost } from "./api.bsky";

type InitialView = {
  kind: "welcome";
};

type ContentView = {
  kind: "content";
  url: string;
  bookmark: ReturnType<typeof getBookmark>;
  posts: ReturnType<typeof getBskyPost>;
};

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs): Promise<InitialView | ContentView> {
  const u = new URL(request.url);
  const url = u.searchParams.get("url");

  if (!isValidUrl(url)) {
    return { kind: "welcome" };
  }

  return {
    kind: "content",
    url,
    bookmark: getBookmark({ url }),
    posts: getBskyPost({ url }),
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  if (loaderData.kind === "welcome") {
    return <Welcome />;
  }

  const { url, bookmark, posts } = loaderData;

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
          <div className="pt-4 pb-4">
            <h2 className="text-2xl font-bold">
              <React.Suspense fallback="はてなブックマーク">
                <Await resolve={bookmark}>
                  {(b) => (
                    <a href={url}>
                      はてなブックマーク ({b.comments.length}/{b.total})
                    </a>
                  )}
                </Await>
              </React.Suspense>
            </h2>
            <List promise={bookmark} />
          </div>
          <div className="pt-4 pb-4">
            <h2 className="text-2xl font-bold">Bluesky</h2>
            <List promise={posts} />
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
