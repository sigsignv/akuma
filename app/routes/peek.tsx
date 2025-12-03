import { redirect } from "react-router";
import type { Route } from "./+types/peek";

export function loader({ request }: Route.LoaderArgs) {
  const url = extractUrl(request);

  throw redirect(`/reactions?url=${encodeURIComponent(url)}`);
}

export default function Peek() {}

function extractUrl(request: Request) {
  const u = new URL(request.url);

  const url = u.searchParams.get("url");
  if (url && URL.canParse(url)) {
    return url;
  }

  /**
   * Handling for Android's Web Share Target API
   * When url parameter is empty, the URL is included in the text parameter
   */
  const text = u.searchParams.get("text");
  if (text) {
    const regexp = /(?:^|\s+)(?<url>https?:\/\/[^\s]+)$/u;
    const url = text.match(regexp)?.groups?.url;
    if (url && URL.canParse(url)) {
      return url;
    }
  }

  throw redirect("/");
}
