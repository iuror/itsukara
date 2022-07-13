import * as path from "https://deno.land/std@0.144.0/path/mod.ts";
import * as flags from "https://deno.land/std@0.144.0/flags/mod.ts";

const cwd = Deno.cwd();
export const OUTPUT = path.resolve(cwd, "./output");
export const ARCHIVE = path.resolve(OUTPUT, "./archive.json");
export const HTML = path.resolve(OUTPUT, "./index.html");
export const CACHED_URL = "https://iuror.github.io/itsukara/archive.json";
export const CACHE_AGE = 2;
export const NOW = Date.now();

const args = flags.parse(Deno.args);
export const TWITTER_ACCESS_TOKEN: string = args["twitter-access-token"];
export const TWITCH_CLIENT_ID: string = args["twitch-client-id"];
export const TWITCH_ACCESS_TOKEN: string = args["twitch-access-token"];

if (!TWITCH_ACCESS_TOKEN || !TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) {
  throw new Error("No token provided");
}
