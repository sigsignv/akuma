import Comment from "~/components/Comment";
import { getBskyPost } from "~/routes/api.bsky";

export async function fetchBlueskyPosts(url: string) {
  return getBskyPost({ url });
}

type BlueskyProps = {
  posts?: Awaited<ReturnType<typeof fetchBlueskyPosts>>;
};

export default function Bluesky({ posts }: BlueskyProps) {
  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-bold">Bluesky</h2>
      <ul className="space-y-4">
        {posts?.map((post) => (
          <li key={post.url} className="space-y-2">
            <Comment
              userId={post.author.id}
              name={post.author.name}
              icon={post.author.icon ?? ""}
              createdAt={post.created_at}
              comment={post.text}
              link={post.url}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
