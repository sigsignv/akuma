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
