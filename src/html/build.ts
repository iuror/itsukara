import { groupVideos, groupVideosByDay, groupVideosByTime } from "./group_videos.ts";
import { Archive } from "../types.ts";
import * as t from "./template/mod.ts";

export function buildHtml(archive: Archive[]): string {
  const videos = groupVideos(archive);
  const videosByDay = groupVideosByDay(videos);

  const htmls: string[] = [];
  for (const day in videosByDay) {
    const videosByTime = groupVideosByTime(videosByDay[day]);

    const videosHtmls: string[] = [];
    for (const time in videosByTime) {
      const videoByTime = videosByTime[time]
        .sort((a, b) => a.name_en > b.name_en ? 1 : a.name_en === b.name_en ? 0 : -1)
        .sort((a, b) => a.time > b.time ? 1 : a.time === b.time ? 0 : -1)
        .reverse();

      const videoHeaderHtml = t.VideoHeader(time);
      let videoHtml = "";
      for (const video of videoByTime) {
        videoHtml += t.VideoItem(video);
      }
      videosHtmls.push(t.VideoList(videoHeaderHtml, videoHtml));
    }
    htmls.push(t.VideoMain(day, videosHtmls));
  }
  const [body, style] = t.markup(t.Body(htmls));

  return t.Html(body, style);
}
