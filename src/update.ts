import { ARCHIVE, HTML, OUTPUT } from "./constants.ts";
import { fetchNewVideoIds } from "./fetch_new_video_ids.ts";
import { filterCacheByAge } from "./filter_cache_by_age.ts";
import { filterIds } from "./filter_ids.ts";
import { getCache } from "./get_cache.ts";
import { getPageMetadata } from "./get_page_metadata.ts";
import { getTwitchVideos } from "./get_twitch_videos.ts";
import { init } from "./init.ts";
import { parseAtom } from "./parse_atom.ts";
import { request } from "./request.ts";
import { sortByDate } from "./sort_by_date.ts";
import { Archive, Metadata } from "./types.ts";
import { members } from "./data/member.ts";
import { buildHtml } from "./html/build.ts";

export async function update(): Promise<void> {
  await init();
  const cache = await getCache();

  const archive: Archive[] = [];
  for (const member of members) {
    const { twitterId, twitchName, channelId } = member;
    let archiveOfUser = cache.find((item) => item.twitterId === twitterId);

    let archiveItems: Metadata[] = [];
    if (archiveOfUser !== undefined) {
      const { archive } = archiveOfUser;
      archiveItems = archive;
    } else {
      archiveOfUser = { ...member, archive: archiveItems };
    }

    let ids: string[] = [];
    let checkTwitchVideos = false;
    if (member.fromSchedule !== undefined) {
      /**
       * some members does not tweet video links, but put out a schedule per week
       * in this case, get video ids by parsing youtube rss
       */
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const res = await request(rssUrl);
      if (res.ok) {
        const document = await res.text();
        ids = parseAtom(document);
      }
    } else {
      const result = await fetchNewVideoIds(twitterId, twitchName);
      if (result !== null) {
        ids = result.ids;
        checkTwitchVideos = result.hasTwitchVideos;
      }
    }

    if (ids) {
      ids = filterIds(ids, archiveItems);

      for (const id of ids) {
        const videoUrl = `https://www.youtube.com/watch?v=${id}`;
        const res = await request(videoUrl);
        const html = await res.text();
        const metadata = getPageMetadata(html);
        /**
         * `<meta name="robots" content="noindex">` in head tag indicates
         * the video is member-only or unlisted (non-archived) one
         * so exclude from archive
         */
        if (metadata.robots === "noindex") continue;

        /* some tweets other channel's video url */
        if (metadata.channelId !== member.channelId) continue;

        /* maybe just video, not live streaming */
        if (metadata.startDate === undefined) continue;
        const startDate = new Date(metadata.startDate).toISOString();

        /**
         * if a start date passed more than cache ages (default 3),
         * not add to archive or exclude from archive
         */
        if (!filterCacheByAge(startDate)) continue;
        metadata.startDate = startDate;
        archiveItems.push(metadata);
      }
    }

    if (twitchName && checkTwitchVideos) {
      const videos = await getTwitchVideos(twitchName);
      if (videos !== null) {
        let ids = videos.map((video) => video.videoId);
        ids = filterIds(ids, archiveItems);
        const newTwitchVideos = videos.filter((video) => ids.includes(video.videoId));
        archiveItems = [...archiveItems, ...newTwitchVideos];
      }
    }
    archiveItems = archiveItems.filter(filterCacheByAge).sort(sortByDate)
      .reverse();
    archiveOfUser = { ...member, archive: archiveItems };
    archive.push(archiveOfUser);
  }

  await Deno.writeTextFile(ARCHIVE, JSON.stringify(archive));
  const html = buildHtml(archive);
  await Deno.writeTextFile(HTML, html);
}
