import { NOW, TWITTER_ACCESS_TOKEN } from "./constants.ts";
import { formatUrl } from "./format_url.ts";
import { request } from "./request.ts";
import { Query, SearchTweetsResponse } from "./types.ts";

const twoHoursAgo = new Date(NOW - (1000 * 60 * 60 * 2)).toISOString();

export async function fetchNewVideoIds(
  twitterId: string,
  twitchName?: string,
): Promise<{ ids: string[]; hasTwitchVideos: boolean } | null> {
  let endpointUrl = "https://api.twitter.com/2/tweets/search/recent";
  let hasTwitchVideos = false;

  const searchUrls = ["youtu.be", "youtube.com"];
  if (twitchName !== undefined) {
    searchUrls.push("twitch.tv");
  }

  const queries: Query = [
    ["query", `from:${twitterId} has:links -is:retweet (${searchUrls.join(" OR ")})`],
    ["expansions", "author_id"],
    ["tweet.fields", "entities,created_at"],
    ["user.fields", "id,name,username,profile_image_url"],
    /* search tweets from up to two hours ago not to request redundantly */
    ["start_time", twoHoursAgo],
  ];
  endpointUrl = formatUrl(endpointUrl, queries);

  const res = await request(endpointUrl, { token: TWITTER_ACCESS_TOKEN });

  if (!res.ok) {
    console.error(`${twitterId} ${res.status}: ${res.statusText}`);
    return null;
  } else {
    const json: SearchTweetsResponse = await res.json();
    const { data } = json;

    if (!data) {
      return null;
    }

    const ids = data.map((item) => {
      const { entities: { urls } } = item;
      return urls;
    })
      .flat()
      .map((url) => {
        const u = url.expanded_url ?? url.unwound_url;
        /**
         * regex pattern for youtube video url
         *
         * pattern1: short url
         * youtube.com/XXXXX
         */
        const p1 = /^(https)?:\/\/(?:[a-z0-9-]+\.)*?(youtu.be)\/([\/\w\.-]*)/;
        /**
         * pattern2: full url, neither playlist nor channel one
         * www.youtube.com/watch?v=XXXXX
         */
        const p2 = /^(https)?:\/\/(?:[a-z0-9-]+\.)*?(youtube.com\/watch\?v\=)([\w\.-]*)/;

        /**
         * regex pattern for Twitch url
         * XXXXX is user name, YYYYY is video id
         * https://(www|m).twitch.tv/XXXXX/YYYYY
         */
        const p3 = /^(https)?:\/\/(?:[a-z0-9-]+\.)*?(twitch.tv)\/([\/\w\.-]*)/;
        const twitchMatched = u.match(p3);
        if (twitchMatched) {
          const [username] = twitchMatched[twitchMatched.length - 1].split("/");
          if (twitchName === username) {
            /* flag changes here */
            hasTwitchVideos = true;
          }
        }

        const youtubeMatched = u.match(p1) || u.match(p2);
        if (youtubeMatched) {
          return youtubeMatched[youtubeMatched.length - 1];
        }
      })
      .filter(Boolean)
      .reduce((prev, curr) => {
        /* remove duplicated urls from array, then return non-duplicated version */
        if (curr !== undefined && !prev.includes(curr)) {
          prev.push(curr);
        }

        return prev;
      }, [] as string[]);

    return { ids, hasTwitchVideos };
  }
}
