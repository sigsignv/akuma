type Props = {
  user: string;
};

export default function AvatarLink({ user }: Props) {
  return (
    <a
      href={`https://b.hatena.ne.jp/${user}/`}
      target="_blank"
      rel="noreferrer"
    >
      <img
        className="size-6 rounded-full object-cover"
        src={`https://cdn.profile-image.st-hatena.com/users/${user}/profile.png`}
        alt={`${user} avatar`}
      />
    </a>
  );
}
