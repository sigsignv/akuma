import type { CommentProps } from "./Comment";
import Comment from "./Comment";

export type Comments = CommentProps[];

export type ListProps = {
  comments: Comments;
};

export default function List({ comments }: ListProps) {
  return (
    <ul className="space-y-4">
      {comments?.map((comment) => (
        <li key={comment.link} className="space-y-2">
          <Comment {...comment} />
        </li>
      ))}
    </ul>
  );
}
