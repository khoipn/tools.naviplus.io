export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = url.searchParams.get('url');

  if (!target) {
    return json({ error: 'Missing url' }, 400);
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
    if (!['http:', 'https:'].includes(targetUrl.protocol)) throw new Error();
  } catch (_) {
    return json({ error: 'Invalid URL' }, 400);
  }

  // Block private IP ranges (basic SSRF guard)
  const host = targetUrl.hostname;
  if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
    return json({ error: 'Forbidden' }, 403);
  }

  try {
    const resp = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
    });

    const text = await resp.text();
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'X-Proxy-Status': String(resp.status),
      },
    });
  } catch (err) {
    return json({ error: err.message || 'fetch_failed' }, 502);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
