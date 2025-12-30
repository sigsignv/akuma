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
            className="absolute top-1 right-1 rounded bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white focus:bg-slate-700  active:bg-slate-700 hover:bg-slate-700"
            type="submit"
          >
            ➡
          </button>
        </div>
      </Form>
    </search>
  );
}
