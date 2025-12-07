type props = {
  title: string;
  children: React.ReactNode;
};

export default function Collapsible({ title, children }: props) {
  return (
    <details className="py-4" open={true}>
      <summary className="text-2xl font-bold cursor-pointer select-none">
        {title}
      </summary>
      <div>{children}</div>
    </details>
  );
}
