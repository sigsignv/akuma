import SearchBar from "~/components/SearchBar";

export function meta() {
  return [
    { title: "Akuma" },
    { name: "description", content: "See what people say about any web page" },
  ];
}

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto flex flex-col items-center justify-center p-4 -mt-16">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold mb-2 text-zinc-800 dark:text-white">
            Akuma
          </h1>
        </div>
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
      </main>

      <footer className="p-4">
        <div className="container mx-auto text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            <a
              href="https://github.com/sigsignv/akuma"
              className="hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Source
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
