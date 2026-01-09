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

type ATUriParts = {
  collection: string;
  rkey: string;
};

/**
 * Parse the given AT URI into its components.
 */
export function parseAtUri(uri: string): ATUriParts | undefined {
  const parts = uri.split("/");

  if (parts.length !== 5) {
    console.log({ kind: "Invalid AT URI format", uri });
    return undefined;
  }

  const collection = parts[3];
  const rkey = parts[4];

  return { collection, rkey };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("parseAtUri", () => {
    it("should parse a valid AT URI", () => {
      const collection = "app.bsky.feed.post";
      const rkey = "rkey";

      const parts = parseAtUri(`at://did:plc:repo/${collection}/${rkey}`);
      expect(parts).toEqual({ collection, rkey });
    });

    it("should return undefined for invalid AT URI", () => {
      const parts = parseAtUri("invalid-uri-format");
      expect(parts).toBeUndefined();
    });
  });
}
