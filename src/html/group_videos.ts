import { sortVideos } from "./sort_videos.ts";
import { VideoInfo, VideosByDay, VideosByTime } from "./types.ts";
import { Archive } from "../types.ts";

export function groupVideos(archive: Archive[]): VideoInfo[] {
  let videos: VideoInfo[] = [];
  for (const member of archive) {
    const { name, name_en, twitterId, channelId, archive } = member;
    if (!archive) continue;

    for (const a of archive) {
      const { title, url, startDate, image, videoId } = a;
      videos.push({
        name,
        name_en,
        twitterId,
        channelId,
        title,
        url,
        startDate,
        image,
        videoId,
        time: "",
      });
    }
  }

  videos = videos.flat();

  return videos;
}

export function groupVideosByDay(videos: VideoInfo[]): VideosByDay {
  let videosByDay = videos.reduce((prev, curr) => {
    const { startDate } = curr;
    const timeToJst = new Date(startDate).toLocaleString("en-GB", {
      timeZone: "JST",
    });
    const [dmy, hms] = timeToJst.split(" ");
    const [d, m] = dmy.split("/");
    const [h, mm] = hms.split(":");
    const day = `${m}/${d}`;
    const time = `${h}:${mm}`;
    curr.time = time;

    let roundedTime = "";
    if (Number(mm) < 30) {
      roundedTime = `${h}:00`;
    } else {
      roundedTime = `${h}:30`;
    }

    if (!prev[day]) {
      prev[day] = {};
      if (!prev[day][roundedTime]) {
        prev[day][roundedTime] = [curr];
      }
    } else {
      if (!prev[day][roundedTime]) {
        prev[day][roundedTime] = [curr];
      } else {
        prev[day][roundedTime].push(curr);
      }
    }

    return prev;
  }, Object.create(null) as VideosByDay);

  videosByDay = sortVideos(videosByDay);

  return videosByDay;
}

export function groupVideosByTime(videos: VideosByTime): VideosByTime {
  return sortVideos(videos);
}
