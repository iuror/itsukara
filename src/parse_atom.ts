import { XMLParser } from "fast-xml-parser/";

import { filterCacheByAge } from "./filter_cache_by_age.ts";
import { Atom } from "./types.ts";

const parser = new XMLParser({ ignoreAttributes: false });

export function parseAtom(document: string): string[] {
  const parsed: Atom = parser.parse(document);

  const { feed: { entry } } = parsed;

  const ids: string[] = [];
  for (const e of entry) {
    let updated = "";
    if ("published" in e) {
      updated = new Date(e.published).toISOString();
    } else if ("updated" in e) {
      updated = new Date(e.updated).toISOString();
    } else {
      updated = new Date().toISOString();
    }

    if (!filterCacheByAge(updated)) continue;

    const videoId = e["yt:videoId"];
    ids.push(videoId);
  }

  return ids;
}
