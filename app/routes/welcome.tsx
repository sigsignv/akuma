import Welcome from "~/components/Welcome";

export function meta() {
  return [
    { title: "Akuma" },
    { name: "description", content: "See what people say about any web page" },
  ];
}

export default function Index() {
  return <Welcome />;
}
