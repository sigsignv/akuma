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

  const entry = await fetchBookmark(url);

  return {
    bookmark: entry,
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return <Viewer bookmark={loaderData.bookmark} />;
}
