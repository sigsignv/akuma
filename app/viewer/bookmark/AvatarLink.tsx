type Props = {
  user: string;
};

export default function AvatarLink({ user }: Props) {
  return (
    <a href={`https://b.hatena.ne.jp/${user}/`} rel="noreferrer">
      <img
        className="w-6 h-6 rounded-full object-cover"
        src={`https://cdn.profile-image.st-hatena.com/users/${user}/profile.png`}
        alt={`avatar of ${user}`}
      />
    </a>
  );
}
