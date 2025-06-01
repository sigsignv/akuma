import type React from "react";

type SectionProps = {
  title: string;
  link: string;
  linkText: string;

  children: React.ReactNode;
};

export default function Section({ title, link, linkText, children }: SectionProps) {
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
