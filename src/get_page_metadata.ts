import * as cheerio from "cheerio/";

import { Metadata } from "./types.ts";

const ogPattern = /\s*(og|twitter)\s*:\s*(description|title|url|(image[\s*:\s*(height|width)]*))/;
const twitterPattern = /^\s*(?:(og|twitter)\s*[\.:]\s*)?(description|title|url|image)\s*/;
const itempropPattern = /(channelId|videoId|startDate)/;

export function getPageMetadata(html: string): Metadata {
  /* get video metadata from `<meta>` tag */
  const values: { [key: string]: string } = {};
  const metadata = {} as Metadata;

  const $ = cheerio.load(html);
  const meta = $("meta");
  for (const m of meta) {
    const content = m.attribs?.content;
    if (content === undefined) continue;

    const property = m.attribs?.property;
    if (property !== undefined) {
      const matched = property.match(ogPattern);
      if (matched) {
        const k = matched[0].toLowerCase().replace(/\s/g, "");
        values[k] = content.trim();
      }
    }

    const name = m.attribs?.name;
    if (name !== undefined) {
      const matched = name.match(twitterPattern);
      if (matched) {
        const k = matched[0].toLowerCase().replace(/\s/g, "");
        values[k] = content.trim();
      }
      if (name === "robots") {
        values[name] = content.trim();
      }
    }

    const itemprop = m.attribs?.itemprop;
    if (itemprop !== undefined) {
      const matched = itemprop.match(itempropPattern);
      if (matched) {
        const k = matched[0].toLowerCase().replace(/\s/g, "");
        values[k] = content.trim();
      }
    }
  }

  metadata.title = values["og:title"] || values["twitter:title"] || values.title;
  metadata.description = values["og:description"] || values["twitter:description"] ||
    values.description;
  metadata.url = values["og:url"] || values["twitter:url"];
  metadata.image = {
    url: values["og:image"] || values["twitter:image"],
    width: Number(values["og:image:width"]),
    height: Number(values["og:image:height"]),
  };
  metadata.channelId = values.channelid;
  metadata.videoId = values.videoid;
  metadata.startDate = values.startdate;
  metadata.robots = values.robots;

  return metadata;
}
