import type React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Collapsible({ title, children }: Props) {
  return (
    <details open={true}>
      <summary className="text-xl font-bold cursor-pointer select-none">
        {title}
      </summary>
      <div>{children}</div>
    </details>
  );
}
