export function Html(body: string, style: string): string {
  return `\
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset='utf-8' />
<meta name='viewport' content='width=device-width, initial-scale=1' />
<title>itsukara</title>
<link rel="icon" sizes="192x192" href="./assets/favicon-192.png">
<link rel="apple-touch-icon" href="./assets/favicon-192.png">
${style}
</head>
${body}
</html>
`.replaceAll("\n", "").trim();
}
