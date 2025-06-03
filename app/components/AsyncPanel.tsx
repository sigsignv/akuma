import React from "react";
import { Await, useAsyncError } from "react-router";
import Notice from "./Notice";
import type { PanelProps } from "./Panel";
import Panel from "./Panel";

export type AsyncProps<T> = PanelProps & {
  promise: Promise<T>;
};

export default function AsyncPanel<T>({ children, promise, ...props }: AsyncProps<T>) {
  return (
    <React.Suspense fallback={<AsyncPanelSkeleton {...props} />}>
      <Await resolve={promise} errorElement={<AsyncPanelError {...props} />}>
        <Panel {...props}>{children}</Panel>
      </Await>
    </React.Suspense>
  );
}

function AsyncPanelSkeleton(props: Omit<PanelProps, "children">) {
  return (
    <Panel {...props}>
      <Notice>Loading...</Notice>
    </Panel>
  );
}

function AsyncPanelError(props: Omit<PanelProps, "children">) {
  const error = useAsyncError() as Error;

  return (
    <Panel {...props}>
      <Notice>{error.message}</Notice>
    </Panel>
  );
}
