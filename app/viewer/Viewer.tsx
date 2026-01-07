import { useNavigation } from "react-router";
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
    <div>
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
    </div>
  );
}
