import { Form } from "react-router";
import { fetchBlueskyPosts } from "~/viewer/Bluesky";
import { Viewer } from "~/viewer/Viewer";
import type { Route } from "./+types/_index";
import { getBookmark } from "./api.bookmark";

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
  const postsPromise = fetchBlueskyPosts(url);

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
        <Form method="get" action="/" className="flex">
          <div className="relative flex-grow">
            <input
              type="url"
              name="url"
              placeholder="URL"
              className="w-full p-2 pr-20 rounded-l"
              defaultValue={url}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full p-2 bg-blue-500 text-white rounded-r"
            >
              Go
            </button>
          </div>
        </Form>
        <div className="py-4">
          <Viewer bookmark={bookmark} result={posts} />
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
