import { Link, Outlet } from "react-router";

export default function PageLayout() {
  return (
    <div className="container mx-auto max-w-xl">
      <div className="flex flex-col mx-2 min-h-dvh md:min-h-auto">
        <header className="p-4">
          <h1 className="text-2xl font-bold hover:underline">
            <Link to="/">Akuma</Link>
          </h1>
        </header>

        <main className="grow bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-md dark:shadow-none">
          <Outlet />
        </main>

        <footer className="p-4">
          <div className="flex justify-center items-center text-zinc-600 dark:text-zinc-400">
            <a
              href="https://github.com/sigsignv/akuma"
              target="_blank"
              rel="noreferrer"
            >
              <span className="iconify mdi--github text-4xl hover:text-zinc-800 dark:hover:text-zinc-300" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
