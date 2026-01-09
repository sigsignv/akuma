/**
 * Generate a Hatena Bookmark entry page URL for the given URL.
 */
export function createEntryPageUrl(url: string): string {
  const escapedUrl = url.replaceAll(/#/g, "%23");
  return `https://b.hatena.ne.jp/entry/${escapedUrl}`;
}
