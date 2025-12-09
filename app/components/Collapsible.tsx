import React from "react";
import { Await } from "react-router";

type props = {
  defaultTitle: string;
  children: React.ReactNode;
  titlePromise?: Promise<string>;
};

export default function Collapsible({
  defaultTitle,
  children,
  titlePromise,
}: props) {
  return (
    <details className="py-4" open={true}>
      <summary className="text-2xl font-bold cursor-pointer select-none">
        {titlePromise ? (
          <React.Suspense fallback={defaultTitle}>
            <Await resolve={titlePromise} errorElement={defaultTitle}>
              {(title) => title}
            </Await>
          </React.Suspense>
        ) : (
          defaultTitle
        )}
      </summary>
      <div>{children}</div>
    </details>
  );
}
