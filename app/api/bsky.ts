import { AtpAgent } from "@atproto/api";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import type { Response as AtpResponse } from "@atproto/api/dist/client/types/app/bsky/feed/searchPosts";
import { filterAccountLabels } from "@atproto/api/dist/moderation/subjects/account";
import type { SearchOptions } from "./types";

export type PostData = {
  hitsTotal: number | undefined;
  comments: CommentProps[];
};

type User = {
  id: string;
  name?: string;
  icon?: string;
  link: string;
};

type CommentProps = {
  author: User;
  content: string;
  createdAt: string;
  link: string;
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

  return {
    hitsTotal: response.data.hitsTotal,
    comments: posts.slice(0, 10),
  };
}

async function fetchPostData({ url, signal, client = fetch }: SearchOptions): Promise<AtpResponse> {
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
  console.log({ kind: "ResponseTime", service: "bsky", timeMs: Date.now() - beginTime });

  return response;
}

async function validatePostData(posts: PostView[]) {
  const bskyPosts: BskyPost[] = [];

  for (const post of posts) {
    if (isUnlistedPost(post)) {
      console.log({ service: "bsky", kind: "UnlistedPost", url: generateUrl(post) });
      continue;
    }

    const { createdAt, text } = post.record;
    if (typeof createdAt !== "string" || typeof text !== "string" || text === "") {
      continue;
    }

    bskyPosts.push({
      author: {
        id: post.author.handle,
        name: post.author.displayName,
        icon: post.author.avatar,
        link: `https://bsky.app/profile/${post.author.handle}`,
      },
      content: text,
      createdAt,
      link: generateUrl(post),
    });
  }

  return bskyPosts;
}

function generateUrl(post: PostView): string {
  const uri = post.uri;
  const id = uri.slice(uri.lastIndexOf("/") + 1);

  return `https://bsky.app/profile/${post.author.handle}/post/${id}`;
}

function isUnlistedPost(post: PostView): boolean {
  return filterAccountLabels(post.author.labels).some(
    (label) => label.val === "!no-unauthenticated",
  );
}
