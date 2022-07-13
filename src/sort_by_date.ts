import { Metadata } from "./types.ts";

export function sortByDate(a: Metadata, b: Metadata): 1 | 0 | -1 {
  return a.startDate > b.startDate ? 1 : a.startDate === b.startDate ? 0 : -1;
}
