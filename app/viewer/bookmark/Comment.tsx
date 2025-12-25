import AvatarLink from "./AvatarLink";
import ElapsedTime from "./ElapsedTime";

type Props = {
  user: string;
  timestamp: string;
  comment: string;
  eid: string;
};

export default function Comment({ user, timestamp, comment, eid }: Props) {
  const link = `https://b.hatena.ne.jp/entry/${eid}/comment/${user}`;

  return (
    <div className="flex gap-2">
      <div className="flex-none pt-1">
        <AvatarLink user={user} />
      </div>
      <div className="flex-auto min-w-0">
        <div className="flex items-center gap-1 text-sm">
          <div className="font-bold overflow-hidden text-ellipsis">{user}</div>
          <div className="flex-none text-gray-600 dark:text-gray-400">･</div>
          <div className="flex-none text-gray-600 dark:text-gray-400">
            <a href={link} rel="noreferrer" className="hover:underline">
              <ElapsedTime timestamp={timestamp} />
            </a>
          </div>
        </div>
        <div>{comment}</div>
      </div>
    </div>
  );
}
