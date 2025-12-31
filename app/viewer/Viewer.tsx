import { Link, useNavigation } from "react-router";
import Bookmark from "~/components/Bookmark";
import Bsky from "~/components/Bsky";
import HackerNews from "~/components/HackerNews";
import SearchBar from "~/components/SearchBar";

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
  const navigation = useNavigation();

  return (
    <div className="container mx-auto max-w-xl">
      <div className="flex flex-col mx-2 min-h-dvh">
        <header className="p-4">
          <h1 className="text-2xl font-bold hover:underline">
            <Link to="/">Akuma</Link>
          </h1>
        </header>

        <main className="grow p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
          <SearchBar url={url} />
          <div style={{ opacity: navigation.state === "loading" ? 0.5 : 1.0 }}>
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

        <footer className="p-4">
          <p>
            <a href="https://github.com/sigsignv/akuma">Source</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
