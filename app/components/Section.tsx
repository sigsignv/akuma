import React from "react";
import { Await, useAsyncError } from "react-router";
import Panel from "./Panel";

type SectionBaseProps = {
  title: string;
  link: string;
  linkText: string;

  children: React.ReactNode;
};

export type SectionProps<T> = SectionBaseProps & {
  promise: Promise<T>;
};

export default function Section<T>({ children, promise, ...props }: SectionProps<T>) {
  return (
    <React.Suspense fallback={<SectionSkeleton {...props} />}>
      <Await resolve={promise} errorElement={<SectionError {...props} />}>
        <SectionBase {...props}>{children}</SectionBase>
      </Await>
    </React.Suspense>
  );
}

function SectionBase({ title, link, linkText, children }: SectionBaseProps) {
  return (
    <Panel title={title} link={{ url: link, text: linkText }}>
      {children}
    </Panel>
  );
}

function SectionMessage({ children, ...props }: SectionBaseProps) {
  return (
    <SectionBase {...props}>
      <div className="flex justify-center items-center">
        <p className="m-4">{children}</p>
      </div>
    </SectionBase>
  );
}

function SectionSkeleton(props: Omit<SectionBaseProps, "children">) {
  return <SectionMessage {...props}>Loading...</SectionMessage>;
}

function SectionError(props: Omit<SectionBaseProps, "children">) {
  const error = useAsyncError() as Error;

  return <SectionMessage {...props}>{error.message}</SectionMessage>;
}
