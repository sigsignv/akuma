import { AtpAgent } from "@atproto/api";
import type { Response as AtpResponse } from "@atproto/api/dist/client/types/app/bsky/feed/searchPosts";
import { filterAccountLabels } from "@atproto/api/dist/moderation/subjects/account";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";

type Author = {
  id: string;
  name?: string;
  icon?: string;
};

type Post = {
  author: Author;
  text: string;
  created_at: string;
  url: string;
};

function generateUrl(post: AtpResponse["data"]["posts"][number]): string {
  const authorId = post.author.handle;
  const postId = post.uri.slice(post.uri.lastIndexOf("/") + 1);

  return `https://bsky.app/profile/${authorId}/post/${postId}`;
}

export async function fetchBlueskyPosts(url: string): Promise<Post[]> {
  const agent = new AtpAgent({ service: "https://public.api.bsky.app" });

  const response = await agent.app.bsky.feed.searchPosts({
    q: url,
    limit: 10,
  });

  const posts = response.data.posts
    .filter((post) => {
      return !filterAccountLabels(post.author.labels).some(
        (label) => label.val === "!no-unauthenticated",
      );
    })
    .map((post) => {
      return {
        author: {
          id: post.author.handle,
          name: post.author.displayName,
          icon: post.author.avatar,
        },
        text: post.record.text as string,
        created_at: post.record.createdAt as string,
        url: generateUrl(post),
      };
    });

  return posts;
}

type BlueskyProps = {
  posts?: Post[];
};

export default function Bluesky({ posts }: BlueskyProps) {
  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-bold">Bluesky</h2>
      <ul className="space-y-4">
        {posts?.map((post) => (
          <li key={post.url} className="space-y-2">
            <div className="flex items-center gap-1">
              <img
                src={post.author.icon}
                alt={post.author.id}
                decoding="async"
                width={24}
                height={24}
              />
              <span className="text-sm font-bold">{post.author.name}</span>
              <span className="text-sm text-gray-600">
                <a href={post.url}>
                  {formatDistanceToNowStrict(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </a>
              </span>
            </div>
            <div className="ml-6">{post.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
