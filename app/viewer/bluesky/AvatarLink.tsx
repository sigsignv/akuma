type Props = {
  handle: string;
  avatar?: string;
};

export default function AvatarLink({ handle, avatar }: Props) {
  const icon = isValidAvatarUrl(avatar) ? (
    <img
      className="size-6 rounded-full object-cover"
      src={toThumbnailUrl(avatar)}
      alt={`avatar of ${handle}`}
    />
  ) : (
    <div className="size-6 rounded-full bg-zinc-200 dark:bg-zinc-800" />
  );

  return (
    <a href={`https://bsky.app/profile/${handle}`} rel="noreferrer">
      {icon}
    </a>
  );
}

function isValidAvatarUrl(avatar: unknown): avatar is string {
  return typeof avatar === "string" && URL.canParse(avatar);
}

/**
 * Convert a Bluesky avatar URL to a thumbnail URL.
 *
 * @see https://bsky.app/profile/jaz.sh/post/3kxybawkodn26
 */
function toThumbnailUrl(avatar: string): string {
  /**
   * Undocumented but used by the official Bluesky app.
   *
   * See also: https://github.com/bluesky-social/social-app/blob/b3f775d1d88957b8cb3f21934c9f70eebb008764/src/view/com/util/UserAvatar.tsx#L616-L624
   */
  return avatar.replace("/img/avatar/plain/", "/img/avatar_thumbnail/plain/");
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("isValidAvatarUrl", () => {
    it("should validate avatar URLs correctly", () => {
      expect(isValidAvatarUrl("https://example.com/avatar.png")).toBe(true);
    });

    it("should invalidate non-URL strings", () => {
      expect(isValidAvatarUrl("not-a-url")).toBe(false);
    });

    it("should invalidate non-string inputs", () => {
      expect(isValidAvatarUrl(undefined)).toBe(false);
    });
  });

  describe("toThumbnailUrl", () => {
    it("should convert avatar URL to thumbnail URL", () => {
      const avatar = "https://cdn.bsky.app/img/avatar/plain/{DID}/{CID}@jpeg";
      const thumbnail =
        "https://cdn.bsky.app/img/avatar_thumbnail/plain/{DID}/{CID}@jpeg";
      expect(toThumbnailUrl(avatar)).toBe(thumbnail);
    });

    it("should return URLs unchanged when they don't match", () => {
      const avatar = "https://example.com/other/path/avatar.jpg";
      expect(toThumbnailUrl(avatar)).toBe(avatar);
    });
  });
}
