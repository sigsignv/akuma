import ElapsedTime from "~/components/ElapsedTime";
import AvatarLink from "./AvatarLink";

type Props = {
  avatar?: string;
  displayName?: string;
  handle: string;
  createdAt: string;
  rkey: string;
  content: string;
};

export default function Post({
  avatar,
  displayName,
  handle,
  createdAt,
  rkey,
  content,
}: Props) {
  const link = `https://bsky.app/profile/${handle}/post/${rkey}`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <div className="flex-none">
          <AvatarLink handle={handle} avatar={avatar} />
        </div>
        <div className="flex-auto min-w-0">
          <div className="flex gap-1 text-sm">
            <div className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">
              {displayName || handle}
            </div>
            <div className="text-zinc-600 dark:text-zinc-400 text-nowrap">
              @{handle}
            </div>
            <div className="flex-none text-zinc-600 dark:text-zinc-400">･</div>
            <div className="flex-none text-zinc-600 dark:text-zinc-400">
              <a href={link} rel="noreferrer" className="hover:underline">
                <ElapsedTime date={createdAt} locale="ja" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="ms-7 wrap-anywhere">{content}</div>
    </div>
  );
}
