/**
 * Extracts the URL string from various fetch input types.
 */
export function extractUrl(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  if (input instanceof Request) {
    return input.url;
  }
  throw new Error("Unsupported input type");
}

/**
 * Merges HeadersInit objects, prioritizing later arguments.
 */
export function mergeHeaders(
  ...headersList: (HeadersInit | undefined)[]
): Headers {
  const headers = new Headers();

  for (const headersInit of headersList) {
    if (!headersInit) {
      continue;
    }
    const currentHeaders = new Headers(headersInit);
    for (const [key, value] of currentHeaders) {
      headers.set(key, value);
    }
  }

  return headers;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("extractUrl", () => {
    it("should extract URL from string input", () => {
      const url = "https://example.com/";
      expect(extractUrl(url)).toBe(url);
    });

    it("should extract URL from URL object", () => {
      const url = "https://example.com/";
      expect(extractUrl(new URL(url))).toBe(url);
    });

    it("should extract URL from Request object", () => {
      const url = "https://example.com/";
      expect(extractUrl(new Request(url))).toBe(url);
    });

    it("should throw error for unsupported input type", () => {
      // @ts-expect-error Testing unsupported type
      expect(() => extractUrl(null)).toThrow("Unsupported input type");
    });
  });

  describe("mergeHeaders", () => {
    it("should create headers from a single argument", () => {
      const defaults = { "User-Agent": "default" };
      const headers = mergeHeaders(defaults);
      expect(headers.get("User-Agent")).toBe("default");
    });

    it("should prioritize later arguments when merging headers", () => {
      const defaults = { "User-Agent": "default" };
      const overrides = { "User-Agent": "overrided" };
      const headers = mergeHeaders(defaults, overrides);
      expect(headers.get("User-Agent")).toBe("overrided");
    });

    it("should handle empty object", () => {
      const headers = mergeHeaders({});
      expect(headers.get("User-Agent")).toBeNull();
    });

    it("should handle empty array", () => {
      const headers = mergeHeaders([]);
      expect(headers.get("User-Agent")).toBeNull();
    });

    it("should skip undefined values", () => {
      const defaults = { "User-Agent": "default" };
      const headers = mergeHeaders(undefined, defaults, undefined);
      expect(headers.get("User-Agent")).toBe("default");
    });
  });
}
