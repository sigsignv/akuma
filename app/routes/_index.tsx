import LocationBar from "~/components/LocationBar";
import Bluesky from "~/viewer/Bluesky";
import Bookmark from "~/viewer/Bookmark";
import type { Route } from "./+types/_index";
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

  if (!url) {
    return {};
  }

  const bookmarkPromise = getBookmark({ url });
  const postsPromise = getBskyPost({ url });

  // todo: Error handling
  const [bookmark, posts] = await Promise.all([bookmarkPromise, postsPromise]);

  return {
    url,
    bookmark,
    posts,
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
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
          <Bookmark bookmark={bookmark} />
          <Bluesky result={posts} />
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
