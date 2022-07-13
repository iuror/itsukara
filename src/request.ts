export async function request(
  url: string,
  { token, client_id }: { token?: string; client_id?: string } = {},
): Promise<Response> {
  const options: RequestInit = { keepalive: true, referrerPolicy: "no-referrer" };
  if (token) {
    /* for Twitter API */
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    if (client_id) {
      /* for Twitch API */
      headers["Client-Id"] = client_id;
    }
    return await fetch(url, { ...options, headers });
  } else {
    return await fetch(url, options);
  }
}
