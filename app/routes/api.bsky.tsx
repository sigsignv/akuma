import { AtpAgent } from "@atproto/api";
import type { Response as SearchResponse } from "@atproto/api/dist/client/types/app/bsky/feed/searchPosts";
import { filterAccountLabels } from "@atproto/api/dist/moderation/subjects/account";
import { data } from "react-router";
import type { Route } from "./+types/api.bsky";

type PostView = SearchResponse["data"]["posts"][number];

type BskyAuthor = {
  id: string;
  name?: string;
  icon?: string;
};

type BskyPost = {
  author: BskyAuthor;
  text: string;
  created_at: string;
  url: string;
};

type GetBskyPostOptions = {
  url: string;
  signal?: AbortSignal;
};

export async function getBskyPost({ url, signal }: GetBskyPostOptions): Promise<BskyPost[]> {
  const resp = await fetchBskyPost({ url, signal });
  if (!resp.success) {
    throw new Error("Oops! Something wrong with the Bluesky search fetch. Please try again later.");
  }

  const publicPosts = resp.data.posts.filter(isPublicPost);
  const posts = publicPosts.map((post) => {
    const author: BskyAuthor = {
      id: post.author.handle,
      name: post.author.displayName,
      icon: post.author.avatar,
    };
    return {
      author,
      text: post.record.text as string,
      created_at: post.record.createdAt as string,
      url: convertUrl(post),
    };
  });
  return posts.slice(0, 10);
}

function fetchBskyPost({ url, signal }: GetBskyPostOptions): Promise<SearchResponse> {
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

  if (!url || !URL.canParse(url)) {
    return data({ error: "Invalid URL" }, { status: 400 });
  }

  return await getBskyPost({ url, signal: request.signal });
}
