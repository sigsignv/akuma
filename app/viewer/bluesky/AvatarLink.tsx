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
    it("validates avatar URLs correctly", () => {
      expect(isValidAvatarUrl("https://example.com/avatar.png")).toBe(true);
    });

    it("invalidates non-URL strings", () => {
      expect(isValidAvatarUrl("not-a-url")).toBe(false);
    });

    it("invalidates non-string inputs", () => {
      expect(isValidAvatarUrl(undefined)).toBe(false);
    });
  });

  describe("toThumbnailUrl", () => {
    it("converts avatar URL to thumbnail URL", () => {
      const avatar = "https://example.com/img/avatar/plain/{DID}/{CID}.png";
      const thumbnail =
        "https://example.com/img/avatar_thumbnail/plain/{DID}/{CID}.png";
      expect(toThumbnailUrl(avatar)).toBe(thumbnail);
    });
  });
}
