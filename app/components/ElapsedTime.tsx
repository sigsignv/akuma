import { formatDistanceToNowStrict } from "date-fns";
import type { FormatDistanceToNowStrictOptions } from "date-fns";
import { ja } from "date-fns/locale";

type ElapsedTimeProps = {
  date: string;
  locale?: string;
};

export default function ElapsedTime({ date, locale }: ElapsedTimeProps) {
  return (
    <time dateTime={date}>
      {formatDistanceToNowStrict(new Date(date), localeToOptions(locale))}
    </time>
  );
}

function localeToOptions(locale?: string): FormatDistanceToNowStrictOptions {
  switch (locale) {
    case "ja":
      return { addSuffix: true, locale: ja };
    default:
      return {};
  }
}
