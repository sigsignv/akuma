import type { QueryOptions, ResultPromise } from "../types";
import { extractUrl, mergeHeaders } from "../utils";
import { type BookmarkResponse, parseBookmark } from "./parse";
import { createEntryPageUrl } from "./utils";

export type BookmarkResult =
  | ({ kind: "comments" } & NonNullable<BookmarkResponse>)
  | { kind: "empty" };

export async function getBookmark({
  url,
  signal,
}: QueryOptions): ResultPromise<BookmarkResult> {
  const response = await fetchBookmark(url, { signal });
  if (!response.ok) {
    throw new Error(createErrorMessage(response.status));
  }

  let r: BookmarkResponse;
  try {
    const data = await response.json();
    r = parseBookmark(data);
  } catch (ex) {
    if (ex instanceof SyntaxError) {
      throw new Error(createErrorMessage(ex.name), { cause: ex });
    }
    throw ex;
  }

  if (!r) {
    return {
      title: createTitle(0, 0),
      value: { kind: "empty" },
      sourceUrl: createEntryPageUrl(url),
    };
  }

  if (r.bookmarks.length === 0) {
    return {
      title: createTitle(0, r.count),
      value: { kind: "empty" },
      sourceUrl: r.entry_url,
    };
  }

  return {
    title: createTitle(r.bookmarks.length, r.count),
    value: { kind: "comments", ...r },
    sourceUrl: r.entry_url,
  };
}

/**
 * Fetch bookmark data from Hatena Bookmark API.
 *
 * @see https://developer.hatena.ne.jp/ja/documents/bookmark/apis/getinfo/
 */
export const fetchBookmark: typeof fetch = async (input, init) => {
  const endpoint = new URL("https://b.hatena.ne.jp/entry/jsonlite/");
  endpoint.searchParams.set("url", extractUrl(input));

  const defaultHeaders = { "User-Agent": "akuma" };
  const headers = mergeHeaders(defaultHeaders, init?.headers);

  let resp: Response;
  try {
    resp = await fetch(endpoint, { ...init, headers });
  } catch (ex) {
    if (ex instanceof DOMException) {
      if (ex.name === "TimeoutError" || ex.name === "AbortError") {
        throw new Error(createErrorMessage(ex.name), { cause: ex });
      }
    }
    throw ex;
  }

  return resp;
};

/**
 * Create error message for bookmark fetch failures.
 */
function createErrorMessage(reason: string | number) {
  return `ブックマークの取得に失敗しました (${reason})`;
}

/**
 * Create title for bookmark panel.
 */
function createTitle(comments: number, total: number) {
  return `はてなブックマーク (${comments} / ${total})`;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  /**
   * @vitest-environment node
   */
  describe("fetchBookmark", () => {
    it("should fetch bookmark data successfully", async () => {
      const url = "https://example.com/";
      const response = await fetchBookmark(url);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty("entry_url");
    });
  });
}
