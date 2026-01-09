type Props = {
  url: string;
  text: string;
};

export default function SourceLink({ url, text }: Props) {
  return (
    <div className="flex justify-center pt-4">
      <a href={url} rel="noreferrer">
        <span className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline">
          {text}
        </span>
      </a>
    </div>
  );
}
