import ElapsedTime from "~/components/ElapsedTime";
import Icon from "~/components/Icon";

export type User = {
  id: string;
  name?: string;
  icon: string;
  link: string;
};

export type Comment = {
  author: User;
  content: string;
  createdAt: string;
  link: string;
};

export default function Comment({ author, content, createdAt, link }: Comment) {
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0">
        <Icon src={author.icon} alt={`${author.name ?? author.id}'s profile icon`} />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{author.id}</span>
          <span className="text-sm text-gray-600">
            <a href={link}>
              <ElapsedTime date={createdAt} locale="ja" />
            </a>
          </span>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
}
