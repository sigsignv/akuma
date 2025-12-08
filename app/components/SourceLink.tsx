type props = {
  url: string;
  text: string;
};

export default function SourceLink({ url, text }: props) {
  return (
    <div className="flex justify-center pt-4">
      <a href={url} target="_blank" rel="noreferrer">
        <span className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
          {text}
        </span>
      </a>
    </div>
  );
}
