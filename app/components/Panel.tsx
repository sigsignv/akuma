import Collapsible from "./Collapsible";
import SourceLink from "./SourceLink";

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
      <SourceLink {...link} />
    </Collapsible>
  );
}
