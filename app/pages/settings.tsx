import { useFetcher } from "react-router";
import { getMutedUsers, unmuteUser } from "~/.client/muteUser";
import type { Route } from "./+types/settings";

export function clientLoader() {
  const MutedBookmarkUsers = getMutedUsers("bookmark");
  const MutedBlueskyUsers = getMutedUsers("bluesky");

  return { bookmark: MutedBookmarkUsers, bluesky: MutedBlueskyUsers };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const service = formData.get("service") as "bookmark" | "bluesky";
  const userId = formData.get("userId") as string;

  if (service && userId) {
    unmuteUser({ service, id: userId });
    return { ok: true, unmuteUser: userId };
  }

  return { ok: false, error: "Invalid request" };
}

interface MutedUserListProps {
  title: string;
  users: string[];
  service: "bookmark" | "bluesky";
  onUnmute: (service: "bookmark" | "bluesky", userId: string) => void;
  isSubmitting: boolean;
}

function MutedUserList({
  title,
  users,
  service,
  onUnmute,
  isSubmitting,
}: MutedUserListProps) {
  return (
    <div className="mb-6 px-2">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {users.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          ミュートしているユーザーはいません
        </p>
      ) : (
        <ul className="space-y-2">
          {users.map((userId) => (
            <li
              key={userId}
              className="flex items-center justify-between gap-2 p-2 rounded bg-zinc-100 dark:bg-zinc-800"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="icon-[mdi--account] text-xl flex-shrink-0 text-zinc-600 dark:text-zinc-400" />
                <span className="truncate">{userId}</span>
              </div>
              <button
                type="button"
                onClick={() => onUnmute(service, userId)}
                disabled={isSubmitting}
                className="flex-shrink-0 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="ミュート解除"
              >
                <span className="icon-[mdi--close] text-xl text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const handleUnmute = (service: "bookmark" | "bluesky", userId: string) => {
    const confirmed = window.confirm(`${userId} のミュートを解除しますか？`);
    if (confirmed) {
      fetcher.submit({ service, userId }, { method: "post" });
    }
  };

  return (
    <div className="p-2">
      <title>Settings - Akuma</title>

      <h2 className="px-2 py-1 mb-4 border-b border-zinc-300 dark:border-zinc-600 text-xl font-bold">
        Settings
      </h2>

      <MutedUserList
        title="ミュート済みユーザー（はてなブックマーク）"
        users={loaderData.bookmark}
        service="bookmark"
        onUnmute={handleUnmute}
        isSubmitting={isSubmitting}
      />

      <MutedUserList
        title="ミュート済みユーザー（Bluesky）"
        users={loaderData.bluesky}
        service="bluesky"
        onUnmute={handleUnmute}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
