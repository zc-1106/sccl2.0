import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Health check ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: !!DEEPSEEK_API_KEY });
});

// ---------- Proxy to DeepSeek ----------
app.post('/api/chat', async (req, res) => {
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'DEEPSEEK_API_KEY not set on server' });
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      return res.status(response.status).json({ error: `DeepSeek API error ${response.status}: ${errText}` });
    }

    // Stream SSE response back to client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Proxy error: ' + error.message });
  }
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🧊 冰箱侠 API proxy running at http://localhost:${PORT}`);
  console.log(`   DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY ? '✅ set' : '❌ MISSING'}`);
});
