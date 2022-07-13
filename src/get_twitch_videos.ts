import { TWITCH_ACCESS_TOKEN, TWITCH_CLIENT_ID } from "./constants.ts";
import { formatUrl } from "./format_url.ts";
import { GetUsersResponse, GetVideosResponse, Metadata, Query } from "./types.ts";
import { request } from "./request.ts";

async function getVideos(user_id: string): Promise<Metadata[] | null> {
  let endpointUrl = "https://api.twitch.tv/helix/videos";
  const queries: Query = [["user_id", user_id], ["period", "day"], ["type", "archive"]];

  endpointUrl = formatUrl(endpointUrl, queries);

  const res = await request(endpointUrl, {
    token: TWITCH_ACCESS_TOKEN,
    client_id: TWITCH_CLIENT_ID,
  });

  if (!res.ok) {
    console.log(`[${user_id}] ${res.status}: ${res.statusText}`);
    return null;
  } else {
    const json: GetVideosResponse = await res.json();
    const { data } = json;

    if (!data) {
      return null;
    }

    const videos: Metadata[] = [];
    for (const item of data) {
      let { id, title, url, description, created_at, thumbnail_url, type } = item;
      if (type !== "archive") continue;
      if (thumbnail_url === "") {
        thumbnail_url = "./assets/twitch.jpeg";
      } else {
        thumbnail_url = thumbnail_url.replace("%{width}", "1280").replace("%{height}", "720")
          .trim();
      }
      videos.push({
        title,
        description,
        url,
        image: { url: thumbnail_url, width: 1280, height: 720 },
        channelId: user_id,
        videoId: id,
        startDate: created_at,
      });
    }
    return videos;
  }
}

async function getTwitchUserId(username: string): Promise<string | null> {
  let endpointUrl = "https://api.twitch.tv/helix/users";
  const queries: Query = [["login", username]];

  endpointUrl = formatUrl(endpointUrl, queries);

  const res = await request(endpointUrl, {
    token: TWITCH_ACCESS_TOKEN,
    client_id: TWITCH_CLIENT_ID,
  });

  if (!res.ok) {
    console.log(`[${username}] ${res.status}: ${res.statusText}`);
    return null;
  } else {
    const json: GetUsersResponse = await res.json();
    const { data } = json;

    if (!data) {
      return null;
    }

    const { id } = data[0];
    return id;
  }
}

export async function getTwitchVideos(username: string): Promise<Metadata[] | null> {
  const user_id = await getTwitchUserId(username);
  if (user_id !== null) {
    return await getVideos(user_id);
  } else {
    return null;
  }
}
