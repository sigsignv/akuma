import { Link, useNavigation } from "react-router";
import Bsky from "~/components/Bsky";
import HackerNews from "~/components/HackerNews";
import SearchBar from "~/components/SearchBar";
import Bookmark from "./bookmark/Bookmark";

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
      <div className="flex flex-col mx-2 min-h-dvh md:min-h-auto">
        <header className="p-4">
          <h1 className="text-2xl font-bold hover:underline">
            <Link to="/">Akuma</Link>
          </h1>
        </header>

        <main className="grow pt-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
          <div className="px-4">
            <SearchBar url={url} />
          </div>

          <div style={{ opacity: navigation.state === "loading" ? 0.5 : 1.0 }}>
            <div className="px-2 my-4">
              <Bookmark promise={bookmark} url={url} />
            </div>
            <div className="px-2 my-4">
              <Bsky promise={posts} url={url} />
            </div>
            <div className="px-2 my-4">
              <HackerNews promise={news} url={url} />
            </div>
          </div>
        </main>

        <footer className="p-4">
          <div className="flex justify-center items-center text-zinc-600 dark:text-zinc-400">
            <a
              href="https://github.com/sigsignv/akuma"
              target="_blank"
              rel="noreferrer"
            >
              <span className="iconify mdi--github text-4xl hover:text-zinc-800 dark:hover:text-zinc-300" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
