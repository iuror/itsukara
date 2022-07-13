export function VideoMain(day: string, videoHtmls: string[]): string {
  return `\
<section class="divide-y divide-gray-200" style="scroll-margin-top: 6.25rem;">
<div class="pb-6 pt-6 sticky top-0 z-40 bg-white">
<h2 class="text-2xl font-extrabold text-gray-900">${day}</h2>
</div>
${videoHtmls.join("\n")}
</section>
`.replaceAll("\n", "").trim();
}
