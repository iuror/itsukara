export function VideoHeader(time: string): string {
  return `\
<h3 class="col-span-3 font-semibold text-gray-900 xl:col-span-1">${time}</h3>
`.replaceAll("\n", "").trim();
}
