import { AtpAgent } from "@atproto/api";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import type { Response as AtpResponse } from "@atproto/api/dist/client/types/app/bsky/feed/searchPosts";
import { isUnlistedPost, parseAtUri } from "~/viewer/bluesky/utils";
import type { SearchOptions } from "./types";

type User = {
  id: string;
  name?: string;
  icon?: string;
};

type CommentProps = {
  author: User;
  content: string;
  createdAt: string;
  rkey: string;
};

export type BskyPost = CommentProps;

class BskyError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = "BskyError";
  }
}

export async function getPost(options: SearchOptions) {
  const response = await fetchPostData(options);
  if (!response.success) {
    throw new BskyError("ポストの取得に失敗しました");
  }

  const posts = await validatePostData(response.data.posts);

  const data = {
    hitsTotal: response.data.hitsTotal,
    comments: posts.slice(0, 10),
  };

  return {
    title: `Bluesky (${data.comments.length})`,
    value: data,
  };
}

async function fetchPostData({
  url,
  signal,
  client = fetch,
}: SearchOptions): Promise<AtpResponse> {
  const agent = new AtpAgent({
    service: "https://api.bsky.app",
    fetch: client,
  });
  const params = {
    q: url,
    limit: 20,
  };

  const beginTime = Date.now();
  const response = await agent.app.bsky.feed.searchPosts(params, { signal });
  console.log({
    kind: "ResponseTime",
    service: "bsky",
    timeMs: Date.now() - beginTime,
  });

  return response;
}

async function validatePostData(posts: PostView[]) {
  const bskyPosts: BskyPost[] = [];

  for (const post of posts) {
    if (isUnlistedPost(post)) {
      continue;
    }

    const { createdAt, text } = post.record;
    if (
      typeof createdAt !== "string" ||
      typeof text !== "string" ||
      text === ""
    ) {
      continue;
    }

    const uriParts = parseAtUri(post.uri);
    if (!uriParts || uriParts.collection !== "app.bsky.feed.post") {
      continue;
    }

    bskyPosts.push({
      author: {
        id: post.author.handle,
        name: post.author.displayName,
        icon: post.author.avatar,
      },
      content: text,
      createdAt,
      rkey: uriParts.rkey,
    });
  }

  return bskyPosts;
}
