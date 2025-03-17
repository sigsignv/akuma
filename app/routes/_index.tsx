import { fetchBlueskyPosts } from "~/viewer/Bluesky";
import { Viewer } from "~/viewer/Viewer";
import { fetchBookmark } from "../viewer/Bookmark";
import type { Route } from "./+types/_index";

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

  const bookmark = await fetchBookmark(url);
  const posts = await fetchBlueskyPosts(url);

  return {
    bookmark,
    posts,
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { bookmark, posts } = loaderData;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Akuma</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="py-4">
          <Viewer bookmark={bookmark} posts={posts} />
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
