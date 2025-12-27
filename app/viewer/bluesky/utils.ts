import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { filterAccountLabels } from "@atproto/api/dist/moderation/subjects/account";

/**
 * Check if the post is restricted to authenticated users only.
 */
export function isUnlistedPost(post: PostView): boolean {
  return filterAccountLabels(post.author.labels).some(
    (label) => label.val === "!no-unauthenticated",
  );
}
