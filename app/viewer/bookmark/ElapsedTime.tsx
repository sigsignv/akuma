import { formatDistanceToNowStrict, formatISO, parse } from "date-fns";
import { ja } from "date-fns/locale";

type Props = {
  timestamp: string;
};

export default function ElapsedTime({ timestamp }: Props) {
  const date = formatToCanonicalDate(timestamp);

  return (
    <time dateTime={formatISO(date)}>
      {formatDistanceToNowStrict(date, { addSuffix: true, locale: ja })}
    </time>
  );
}

function formatToCanonicalDate(timestamp: string): Date {
  return parse(`${timestamp} +09:00`, "yyyy/MM/dd HH:mm xxx", new Date());
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("formatToCanonicalDate", () => {
    it("should format timestamp to ISO string", () => {
      const timestamp = "2020/01/02 12:34";
      const result = formatToCanonicalDate(timestamp);
      expect(result).toEqual(new Date("2020-01-02T12:34:00+09:00"));
    });
  });
}
