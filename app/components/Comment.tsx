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
    <div>
      <div className="flex items-center gap-1">
        <Icon src={icon} alt={`${userId}'s profile icon`} />
        <span className="text-sm font-bold">{userId}</span>
        <span className="text-sm text-gray-600">
          <a href={link}>
            <ElapsedTime date={createdAt} locale="ja" />
          </a>
        </span>
      </div>
      <div className="ml-6">{comment}</div>
    </div>
  );
}
