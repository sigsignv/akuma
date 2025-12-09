import React from "react";
import { Await, useAsyncError } from "react-router";
import Collapsible from "./Collapsible";
import Notice from "./Notice";
import SourceLink from "./SourceLink";

export type AsyncProps<T> = {
  title?: string;
  defaultTitle: string;
  link: {
    url: string;
    text: string;
  };
  children: React.ReactNode;
  promise: Promise<T>;
};

export default function AsyncPanel<T>({
  children,
  promise,
  title,
  defaultTitle,
  link,
}: AsyncProps<T>) {
  return (
    <Collapsible title={title || defaultTitle}>
      <React.Suspense fallback={<AsyncPanelSkeleton />}>
        <Await resolve={promise} errorElement={<AsyncPanelError />}>
          {children}
        </Await>
      </React.Suspense>
      <SourceLink {...link} />
    </Collapsible>
  );
}

function AsyncPanelSkeleton() {
  return <Notice>Loading...</Notice>;
}

function AsyncPanelError() {
  const error = useAsyncError() as Error;

  return <Notice>{error.message}</Notice>;
}
