import { Videos, VideosByDay, VideosByTime } from "./types.ts";

export function sortVideos<T extends VideosByDay | VideosByTime>(
  obj: T,
): Videos<T> {
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b)).reverse();
  return keys.reduce((prev, curr) => {
    prev[curr] = obj[curr];

    return prev;
  }, Object.create(null) as Videos<T>);
}
