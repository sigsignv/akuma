import React from "react";
import { Await } from "react-router";
import type { CommentProps } from "./Comment";
import Comment from "./Comment";

export type Comments = CommentProps[];

export type ListProps = {
  comments: Comments;
};

export type ListPropsWithPromise =
  | ListProps
  | {
      promise: Promise<ListProps>;
    };

export default function List(props: ListPropsWithPromise) {
  return (
    <ul className="space-y-4">
      {"comments" in props && <ListView {...props} />}
      {"promise" in props && (
        <React.Suspense fallback={<li>Loading...</li>}>
          <Await resolve={props.promise}>
            {({ comments }) => <ListView comments={comments} />}
          </Await>
        </React.Suspense>
      )}
    </ul>
  );
}

function ListView({ comments }: ListProps) {
  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.link} className="space-y-2">
          <Comment {...comment} />
        </li>
      ))}
    </ul>
  );
}
