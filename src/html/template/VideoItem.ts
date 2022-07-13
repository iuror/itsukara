import { VideoInfo } from "../types.ts";

export function VideoItem(video: VideoInfo) {
  const { url, videoId, time, title, name, image: { url: image_url } } = video;
  return `\
<div class="group relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black ring-opacity-5">
<div class="relative overflow-hidden bg-gray-100 pt-[50%]">
<a href="${url}">
<figure>
<img class="absolute inset-0 h-full w-full" src="${image_url}" alt="video-cover-${videoId}" loading="lazy" decoding="async">
<figcaption class="absolute top-0 left-0 rounded bg-black text-white text-sm p-1">${time}</figcaption>
</figure>
</a>
</div>
<div class="py-3 px-4">
<p class="mb-1 text-sm font-medium text-gray-900">
<a href="${url}">${title}</a>
</p>
<p class="text-xs font-medium text-gray-500">${name}</p>
</div>
</div>
`.replaceAll("\n", "").trim();
}
