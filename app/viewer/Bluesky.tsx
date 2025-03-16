import { AtpAgent } from "@atproto/api";

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

export async function fetchBlueskyPosts(url: string): Promise<Post[]> {
  const agent = new AtpAgent({ service: "https://public.api.bsky.app" });

  const response = await agent.app.bsky.feed.searchPosts({
    q: url,
    limit: 10,
  });

  const posts = response.data.posts.map((post) => {
    return {
      author: {
        id: post.author.handle,
        name: post.author.displayName,
        icon: post.author.avatar,
      },
      text: post.record.text as string,
      created_at: post.record.createdAt as string,
      url: "", // todo: generate URL
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
          <li key={post.author.id}>{post.text}</li>
        ))}
      </ul>
    </div>
  );
}
