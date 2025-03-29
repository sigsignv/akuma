import ElapsedTime from "~/components/ElapsedTime";
import Icon from "~/components/Icon";

export type User = {
  id: string;
  name?: string;
  icon?: string;
  link: string;
};

export type CommentProps = {
  author: User;
  content: string;
  createdAt: string;
  link: string;
};

export default function Comment({ author, content, createdAt, link }: CommentProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-shrink-0">
        <a href={author.link} target="_blank" rel="noreferrer">
          <Icon src={author.icon} alt={`${author.name ?? author.id}'s profile icon`} />
        </a>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-1">
          {!author.name ? (
            <span className="text-sm font-bold">{author.id}</span>
          ) : (
            <>
              <span className="text-sm font-bold">{author.name}</span>
              <span className="text-sm text-gray-600">@{author.id}</span>
            </>
          )}
          <span className="text-sm text-gray-600">・</span>
          <a href={link} target="_blank" rel="noreferrer">
            <span className="text-sm text-gray-600 no-underline hover:underline">
              <ElapsedTime date={createdAt} locale="ja" />
            </span>
          </a>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
}
