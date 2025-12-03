import { Form } from "react-router";

type LocationBarProps = {
  url?: string;
};

export default function LocationBar({ url }: LocationBarProps) {
  return (
    <Form method="get" action="/peek">
      <div className="flex">
        <input
          className="grow p-2 border-y border-s rounded-s"
          type="url"
          name="url"
          defaultValue={url}
          placeholder="https://example.com/"
        />
        <button className="p-2 bg-blue-500 text-white rounded-e" type="submit">
          View
        </button>
      </div>
    </Form>
  );
}
