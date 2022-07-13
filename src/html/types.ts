import { Archive, Metadata } from "../types.ts";

export type VideoInfo =
  & Pick<Metadata, "title" | "url" | "startDate" | "image" | "videoId">
  & Pick<Archive, "name" | "twitterId" | "channelId" | "name_en">
  & { time: string };

export type VideosByDay = { [date: string]: VideosByTime };
export type VideosByTime = { [time: string]: VideoInfo[] };

export type Videos<T extends VideosByDay | VideosByTime> = T extends VideosByDay ? VideosByDay
  : VideosByTime;
