import { redirect } from "react-router";
import type { Route } from "./+types/share";

export function loader({ request }: Route.LoaderArgs) {
  const u = new URL(request.url);
  const text = u.searchParams.get("text");
  const url = u.searchParams.get("url");

  if (url && URL.canParse(url)) {
    throw redirectToReactions(url);
  }

  if (text) {
    const regexp = /\s+(?<url>https?:\/\/[^\s]+)$/u;
    const url = text.match(regexp)?.groups?.url;
    if (url && URL.canParse(url)) {
      throw redirectToReactions(url);
    }
  }

  throw redirect("/");
}

function redirectToReactions(url: string) {
  return redirect(`/reactions?url=${encodeURIComponent(url)}`);
}
