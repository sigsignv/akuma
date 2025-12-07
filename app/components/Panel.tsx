import Collapsible from "./Collapsible";

export type PanelProps = {
  title?: string;
  defaultTitle: string;
  link: {
    url: string;
    text: string;
  };
  children: React.ReactNode;
};

export default function Panel({
  title,
  defaultTitle,
  link,
  children,
}: PanelProps) {
  return (
    <Collapsible title={title || defaultTitle}>
      <div>{children}</div>
      <div className="flex justify-center pt-4">
        <a href={link.url} target="_blank" rel="noreferrer">
          <span className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
            {link.text}
          </span>
        </a>
      </div>
    </Collapsible>
  );
}
