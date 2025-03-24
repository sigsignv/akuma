import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import Icon from "~/components/Icon";
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
            <div className="flex items-center gap-1">
              <Icon src={post.author.icon ?? ""} alt={post.author.id} />
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
