/**
 * Vercel Edge Function — proxies /api/chat → DeepSeek API
 * Runs on the same domain as the frontend, no CORS issues.
 */
export const runtime = 'edge';

export async function POST(request) {
  const API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();

    const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => 'Unknown error');
      return new Response(JSON.stringify({ error: `DeepSeek API ${upstream.status}: ${text}` }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream SSE response back to client
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy error: ' + error.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
