import React from "react";
import { Await, useAsyncError } from "react-router";
import Collapsible from "./Collapsible";
import Notice from "./Notice";
import SourceLink from "./SourceLink";

export type SourceResult<T> = {
  value: T;
  title?: string;
  sourceUrl?: string;
};

type BaseProps = {
  defaultTitle: string;
  link: {
    text: string;
    url: string;
  };
};

type Props<T> = BaseProps & {
  children: (value: T) => React.ReactNode;
  promise: Promise<SourceResult<T>>;
};

export default function Panel<T>(props: Props<T>) {
  const { defaultTitle, link, children, promise } = props;

  return (
    <React.Suspense fallback={<PanelSkeleton {...props} />}>
      <Await resolve={promise} errorElement={<PanelError {...props} />}>
        {({ value, title, sourceUrl }) => (
          <Collapsible title={title ?? defaultTitle}>
            {children(value)}
            <SourceLink url={sourceUrl ?? link.url} text={link.text} />
          </Collapsible>
        )}
      </Await>
    </React.Suspense>
  );
}

function PanelSkeleton({ defaultTitle, link }: BaseProps) {
  return (
    <Collapsible title={defaultTitle}>
      <Notice>Loading...</Notice>
      <SourceLink {...link} />
    </Collapsible>
  );
}

function PanelError({ defaultTitle, link }: BaseProps) {
  const error = useAsyncError() as Error;

  return (
    <Collapsible title={defaultTitle}>
      <Notice>{error.message}</Notice>
      <SourceLink {...link} />
    </Collapsible>
  );
}
