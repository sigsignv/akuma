import Bookmark from "~/components/Bookmark";
import Bsky from "~/components/Bsky";
import HackerNews from "~/components/HackerNews";
import LocationBar from "~/components/LocationBar";

type BookmarkProps = Parameters<typeof Bookmark>[0]["promise"];

type BskyProps = Parameters<typeof Bsky>[0]["promise"];

type HackerNewsProps = Parameters<typeof HackerNews>[0]["promise"];

type Props = {
  url: string;
  bookmark: BookmarkProps;
  posts: BskyProps;
  news: HackerNewsProps;
};

export default function Viewer({ url, bookmark, posts, news }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Akuma</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-xl p-4">
        <LocationBar url={url} />
        <div className="py-4">
          <div className="bookmark">
            <Bookmark promise={bookmark} url={url} />
          </div>
          <div className="bsky">
            <Bsky promise={posts} url={url} />
          </div>
          <div className="hackernews">
            <HackerNews promise={news} url={url} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <p>
            <a href="https://github.com/sigsignv/akuma">Source</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
