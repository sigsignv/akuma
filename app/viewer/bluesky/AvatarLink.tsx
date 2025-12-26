type Props = {
  handle: string;
  avatar?: string;
};

export default function AvatarLink({ handle, avatar }: Props) {
  const icon = isValidAvatarUrl(avatar) ? (
    <img
      className="size-6 rounded-full object-cover"
      src={avatar}
      alt={`avatar of ${handle}`}
    />
  ) : (
    <div className="size-6 rounded-full bg-gray-200 dark:bg-gray-800" />
  );

  return (
    <a href={`https://bsky.app/profile/${handle}`} rel="noreferrer">
      {icon}
    </a>
  );
}

function isValidAvatarUrl(avatar: unknown): boolean {
  return typeof avatar === "string" && URL.canParse(avatar);
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
}
