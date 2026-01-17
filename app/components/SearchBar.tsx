import { Form } from "react-router";

type Props = {
  url?: string;
};

export default function SearchBar({ url }: Props) {
  return (
    <search className="container">
      <Form method="get" action="/peek">
        <div className="relative">
          <input
            className="w-full text-sm border rounded-md pl-3 pr-12 py-2 focus:border-transparent"
            type="url"
            name="url"
            defaultValue={url}
            placeholder="e.g., https://example.com/"
          />
          <button
            className="absolute top-1 right-1 rounded bg-zinc-800 p-1 border-3 border-transparent text-center text-sm text-white focus:bg-zinc-700 active:bg-zinc-700 hover:bg-zinc-700 select-none flex items-center justify-center"
            type="submit"
          >
            <span className="iconify mdi--arrow-right-thick h-4 w-4" />
          </button>
        </div>
      </Form>
    </search>
  );
}
