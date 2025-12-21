/**
 * Fetch bookmark data from Hatena Bookmark API.
 *
 * @see https://developer.hatena.ne.jp/ja/documents/bookmark/apis/getinfo/
 */
export const fetchBookmark: typeof fetch = async (input, init) => {
  const endpoint = new URL("https://b.hatena.ne.jp/entry/jsonlite/");
  endpoint.searchParams.set("url", extractUrl(input));

  // Todo: Support merging init?.headers
  const headers = new Headers({
    "User-Agent": "akuma",
  });

  let resp: Response;
  try {
    resp = await fetch(endpoint, { ...init, headers });
  } catch (ex) {
    if (ex instanceof DOMException) {
      if (ex.name === "TimeoutError" || ex.name === "AbortError") {
        const message = `ブックマークの取得に失敗しました (${ex.name})`;
        throw new Error(message, { cause: ex });
      }
    }
    throw ex;
  }

  if (!resp.ok) {
    throw new Error(`ブックマークの取得に失敗しました (${resp.status})`);
  }

  return resp;
};

/**
 * Extract URL from various fetch input types.
 */
function extractUrl(input: Parameters<typeof fetch>[0]): string {
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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("fetchBookmark", () => {
    it("should fetch bookmark data successfully", async () => {
      const url = "https://example.com/";
      const response = await fetchBookmark(url);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty("entry_url");
    });
  });

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
      expect(() => extractUrl(42)).toThrow("Unsupported input type");
    });
  });
}
