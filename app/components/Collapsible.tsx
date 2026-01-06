import type React from "react";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Collapsible({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const onToggle: React.ToggleEventHandler<HTMLDetailsElement> = (ev) => {
    setIsOpen(ev.newState === "open");
  };

  return (
    <details open={true} onToggle={onToggle}>
      <summary className="list-none text-xl font-bold cursor-pointer select-none">
        <div className="flex items-center justify-between gap-1 min-w-0 min-h-12 px-2 border-b border-zinc-300 dark:border-zinc-600">
          <div className="flex-auto overflow-hidden whitespace-nowrap text-ellipsis">
            {title}
          </div>
          <div className="flex-none flex items-center justify-center">
            {isOpen ? (
              <span className="iconify mdi--expand-less"></span>
            ) : (
              <span className="iconify mdi--expand-more"></span>
            )}
          </div>
        </div>
      </summary>
      <div>{children}</div>
    </details>
  );
}
