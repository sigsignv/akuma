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

  return {
    bookmark,
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { bookmark } = loaderData;

  return <Viewer bookmark={bookmark} />;
}
