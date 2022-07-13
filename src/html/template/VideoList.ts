export function VideoList(videosHeader: string, video: string): string {
  return `\
<div class="grid grid-cols-3 gap-x-8 gap-y-6 py-8 xl:grid-cols-4">
${videosHeader}
<div class="col-span-3 grid gap-6 sm:grid-cols-2 sm:gap-y-8 md:grid-cols-3 lg:gap-x-8">
${video}
</div>
</div>
`.replaceAll("\n", "").trim();
}
