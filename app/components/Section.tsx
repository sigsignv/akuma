import type React from "react";
import AsyncPanel from "./AsyncPanel";

type SectionBaseProps = {
  title: string;
  link: string;
  linkText: string;

  children: React.ReactNode;
};

export type SectionProps<T> = SectionBaseProps & {
  promise: Promise<T>;
};

export default function Section<T>({ link, linkText, ...props }: SectionProps<T>) {
  return <AsyncPanel link={{ url: link, text: linkText }} {...props} />;
}
