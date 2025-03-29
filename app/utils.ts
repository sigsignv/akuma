export function isValidUrl(url: unknown): url is string {
  if (typeof url !== "string" || !URL.canParse(url)) {
    return false;
  }

  const u = new URL(url);
  return u.protocol === "https:" || u.protocol === "http:";
}
