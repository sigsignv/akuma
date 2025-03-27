import ElapsedTime from "~/components/ElapsedTime";
import Icon from "~/components/Icon";

export type CommentProps = {
  userId: string;
  name?: string;
  icon: string;
  createdAt: string;
  link?: string;
  comment: string;
};

export default function Comment({ userId, name, icon, createdAt, comment, link }: CommentProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0">
        <Icon src={icon} alt={`${userId}'s profile icon`} />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{userId}</span>
          <span className="text-sm text-gray-600">
            <a href={link}>
              <ElapsedTime date={createdAt} locale="ja" />
            </a>
          </span>
        </div>
        <div>{comment}</div>
      </div>
    </div>
  );
}
