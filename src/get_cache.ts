import { CACHED_URL } from "./constants.ts";
import { request } from "./request.ts";
import { Archive } from "./types.ts";

export async function getCache(): Promise<Archive[]> {
  let cache: Archive[] = [];

  try {
    const res = await request(CACHED_URL);
    cache = await res.json();
  } catch (_) {
    cache = [];
  }

  return cache;
}
