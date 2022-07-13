import { Configuration, create } from "twind/";
import { getStyleTag, shim, virtualSheet } from "twind/shim/server";

export function markup(htmlString: string): [string, string] {
  const config: Configuration = {};
  const sheet = virtualSheet();
  const { tw } = create({ sheet, ...config });
  const body = shim(htmlString, { tw });
  const style = getStyleTag(sheet);

  return [body, style];
}
