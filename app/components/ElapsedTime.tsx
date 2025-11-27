import type { FormatDistanceToNowStrictOptions } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";

type ElapsedTimeProps = {
  date: string;
  locale?: string;
};

export default function ElapsedTime({ date, locale }: ElapsedTimeProps) {
  const options = localeToOptions(locale);

  return <time dateTime={date}>{formatDistanceToNowStrict(date, options)}</time>;
}

function localeToOptions(locale?: string): FormatDistanceToNowStrictOptions {
  switch (locale) {
    case "ja":
      return { addSuffix: true, locale: ja };
    default:
      return {};
  }
}
