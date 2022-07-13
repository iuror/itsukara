import { CACHE_AGE, NOW } from "./constants.ts";
import { Metadata } from "./types.ts";

export function filterCacheByAge(date: string | Metadata): boolean {
  let timestamp = NaN;
  if (typeof date !== "string") {
    timestamp = new Date(date.startDate).getTime();
  } else {
    timestamp = new Date(date).getTime();
  }
  const between = NOW - timestamp;
  const millsecondsPerDay = 1000 * 60 * 60 * 24;

  const age = Math.round(between / millsecondsPerDay);
  return age < CACHE_AGE && age > -CACHE_AGE;
}
