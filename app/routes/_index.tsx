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
  bookmark: Awaited<ReturnType<typeof getBookmark>>;
  posts: Awaited<ReturnType<typeof getBskyPost>>;
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

  const bookmarkPromise = getBookmark({ url });
  const postsPromise = getBskyPost({ url });

  // todo: Error handling
  const [bookmark, posts] = await Promise.all([bookmarkPromise, postsPromise]);

  return {
    kind: "content",
    url,
    bookmark,
    posts,
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  if (loaderData.kind === "welcome") {
    return <Welcome />;
  }

  const { url, bookmark, posts } = loaderData;

  const bookmarkCounts = {
    total: bookmark?.total ?? 0,
    comments: bookmark?.comments.length ?? 0,
  };

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
              <a href={bookmark.url}>
                はてなブックマーク ({bookmarkCounts.comments}/{bookmarkCounts.total})
              </a>
            </h2>
            <List {...bookmark} />
          </div>
          <div className="pt-4 pb-4">
            <h2 className="text-2xl font-bold">Bluesky</h2>
            <List {...posts} />
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
