import React from "react";
import { Await } from "react-router";
import ElapsedTime from "~/components/ElapsedTime";
import Icon from "~/components/Icon";
import type { getBskyPost } from "../routes/api.bsky";
import Section from "./Section";

type BlueskyProps = {
  promise: ReturnType<typeof getBskyPost>;
};

export default function Bsky({ promise }: BlueskyProps) {
  return (
    <Section title="Bluesky" link="https://bsky.app" linkText="bsky.app を見る">
      <div className="flex justify-center items-center">
        <React.Suspense fallback={<li>Loading...</li>}>
          <Await resolve={promise} errorElement={<li>Error</li>}>
            {({ comments }) => (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c.link} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <a href={c.author.link} target="_blank" rel="noreferrer">
                          <Icon src={c.author.icon} alt={`${c.author.name}'s profile icon`} />
                        </a>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold">{c.author.name}</span>
                          <span className="text-sm text-gray-600">@{c.author.id}</span>
                          <span className="text-sm text-gray-600">・</span>
                          <a href={c.link} target="_blank" rel="noreferrer">
                            <span className="text-sm text-gray-600 no-underline hover:underline">
                              <ElapsedTime date={c.createdAt} locale="ja" />
                            </span>
                          </a>
                        </div>
                        <div>{c.content}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Await>
        </React.Suspense>
      </div>
    </Section>
  );
}
