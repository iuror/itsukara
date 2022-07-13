import { NOW } from "../../constants.ts";

const now = new Date(NOW).toISOString();

export function Body(htmls: string[]): string {
  return `\
<body class="h-full font-sans antialiased text-gray-600 min-h-full flex flex-col">
<main class="flex-auto">
<div class="mx-auto max-w-container space-y-8 px-4 pt-16 pb-24 sm:px-6 lg:px-8">
<nav class="bg-white font-medium text-gray-900">
<div class="mx-auto flex max-w-container space-x-5">
<p class="flex items-center">Last Updated: ${now}</p>
</div>
</nav>
${htmls.join("\n")}
</div>
</main>
</body>`.replace("\n", "").trim();
}
