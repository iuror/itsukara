import { Metadata } from "./types.ts";

export function filterIds(ids: string[], archive: Metadata[]): string[] {
  /* extract only video ids that does not include archive */
  const videoIdsOfArchive = archive.map((a) => a.videoId);
  return ids.filter((id) => !videoIdsOfArchive.includes(id));
}
