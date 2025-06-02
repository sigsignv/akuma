import React from "react";
import { Await, useAsyncError } from "react-router";

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
    <details className="pt-4 pb-4" open={true}>
      <summary className="text-2xl font-bold cursor-pointer select-none">{title}</summary>
      <div>{children}</div>
      <div className="flex justify-center pt-4">
        <a href={link} target="_blank" rel="noreferrer">
          <span className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
            {linkText}
          </span>
        </a>
      </div>
    </details>
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
