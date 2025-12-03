import { redirect } from "react-router";
import type { Route } from "./+types/reactions";

/**
 * @deprecated use "peek" route instead
 */
export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  throw redirect(`/peek?${url.searchParams.toString()}`);
}
