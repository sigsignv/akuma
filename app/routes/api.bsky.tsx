import { AtpAgent } from "@atproto/api";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { filterAccountLabels } from "@atproto/api/dist/moderation/subjects/account";
import { data } from "react-router";
import type { Comments, ListProps } from "~/components/List";
import { isValidUrl } from "~/utils";
import type { Route } from "./+types/api.bsky";

type BskySearchResult = ListProps & {};

type GetBskyPostOptions = {
  url: string;
  signal?: AbortSignal;
};

export async function getBskyPost({ url, signal }: GetBskyPostOptions): Promise<BskySearchResult> {
  const resp = await fetchBskyPost({ url, signal });
  if (!resp.success) {
    throw new Error("Oops! Something wrong with the Bluesky search fetch. Please try again later.");
  }

  const posts: Comments = [];
  for (const post of resp.data.posts) {
    if (!isPublicPost(post)) {
      continue;
    }

    const { text, createdAt } = post.record;
    if (typeof text !== "string" || typeof createdAt !== "string") {
      continue;
    }
    if (text === "") {
      continue;
    }

    posts.push({
      author: {
        id: post.author.handle,
        name: post.author.displayName,
        icon: post.author.avatar,
        link: `https://bsky.app/profile/${post.author.handle}`,
      },
      content: text,
      createdAt,
      link: convertUrl(post),
    });
  }

  return {
    comments: posts.slice(0, 10),
  };
}

function fetchBskyPost({ url, signal }: GetBskyPostOptions) {
  const agent = new AtpAgent({ service: "https://public.api.bsky.app" });
  return agent.app.bsky.feed.searchPosts(
    {
      q: url,
      limit: 50,
    },
    {
      signal,
    },
  );
}

function convertUrl(post: PostView): string {
  const uri = post.uri;
  const id = uri.slice(uri.lastIndexOf("/") + 1);

  return `https://bsky.app/profile/${post.author.handle}/post/${id}`;
}

function isPublicPost(post: PostView): boolean {
  return !filterAccountLabels(post.author.labels).some(
    (label) => label.val === "!no-unauthenticated",
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const u = new URL(request.url);
  const url = u.searchParams.get("url");

  if (!isValidUrl(url)) {
    return data({ error: "Invalid URL" }, { status: 400 });
  }

  return await getBskyPost({ url, signal: request.signal });
}
