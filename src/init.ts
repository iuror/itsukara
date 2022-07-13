import * as fs from "https://deno.land/std@0.144.0/fs/mod.ts";

import { OUTPUT } from "./constants.ts";

export async function init(): Promise<void> {
  await fs.ensureDir(OUTPUT);
}
