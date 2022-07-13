export type Member = {
  name: string;
  name_en: string;
  twitterId: string;
  channelId: string;
  fromSchedule?: boolean;
  twitchName?: string;
};

export type Metadata = {
  title: string;
  description: string;
  url: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  channelId: string;
  videoId: string;
  startDate: string;
  robots?: string;
};

export type Archive = Member & {
  archive: Metadata[];
};

export type Query = [string, string][];

export type SearchTweetsResponse = {
  data: SearchTweet[];
  includes: Includes;
  meta: Meta;
};

type SearchTweet = {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  entities: Entities;
};

type Includes = {
  users: Array<{
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  }>;
};

type Meta = {
  newest_id: string;
  oldest_id: string;
  result_count: number;
  next_token: string;
};

type Entities = {
  urls: TweetURL[];
};

type TweetURL = {
  expanded_url: string;
  unwound_url?: string;
  title?: string;
  description?: string;
  images?: Image[];
};

type Image = {
  url: string;
  width: number;
  height: number;
};

export type GetUsersResponse = {
  data: Array<{
    broadcaster_type: string;
    description: string;
    display_name: string;
    id: string;
    login: string;
    offline_image_url: string;
    profile_image_url: string;
    type: string;
    view_count: number;
    email: string;
    created_at: string;
  }>;
};

export type GetVideosResponse = {
  data: Array<{
    id: string;
    stream_id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    title: string;
    description: string;
    created_at: string;
    published_at: string;
    url: string;
    thumbnail_url: string;
    viewable: "public" | "private";
    view_count: number;
    language: string;
    type: "upload" | "archive" | "highlight";
    duration: number;
    muted_segments: null | { duration: number; offset: number };
    pagination: { cursor: string };
  }>;
};

export type Atom = {
  feed: {
    title: string;
    link: Array<LinkAttribute> | LinkAttribute;
    updated: string;
    entry: Array<{
      id: string;
      "yt:videoId": string;
      "yt:channelId": string;
      title: string;
      link: Array<LinkAttribute> | LinkAttribute;
      updated: string;
      published: string;
      content: {
        "#text": string;
        "@_type": string;
      };
      "media:group": {
        "media:title": string;
        "media:description": string;
        "media:thumbnail": {
          "@_url": string;
          "@_width": string;
          "@_height": string;
        };
      };
    }>;
  };
};

type LinkAttribute = {
  "@_rel": string;
  "@_type": string;
  "@_href": string;
};

type TitleAttribute = {
  "#text": string;
  "@_type": string;
};
