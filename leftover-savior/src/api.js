// In dev, Vite proxies /api → localhost:3001. In prod, set VITE_API_BASE to the proxy server URL.
const API_BASE = import.meta.env.VITE_API_BASE || '';
const API_URL = `${API_BASE}/api/chat`;

/**
 * Build system prompt based on mode, language, and preferences
 */
function buildSystemPrompt(mode, lang, prefs = {}) {
  const langMap = { zh: '中文', en: 'English', jp: '日本語' };
  const outputLang = langMap[lang] || '中文';

  const modeInstructions = {
    lazy: `
【懒人模式规则】
- 只用现有食材+基本调料（盐、酱油、醋、油）
- 步骤不超过4步，每步简短
- 总烹饪时间不超过15分钟
- 即使缺调料，只要基本调料（盐、酱油、醋、油）有就不算缺失
- 优先推荐炒、煮、凉拌等快手做法`,
    hardcore: `
【硬核模式规则】
- 认真对待烹饪，步骤可以多一些但需合理
- 可以建议常用调料（蚝油、料酒、豆瓣酱等），缺失需列出
- 总烹饪时间不超过60分钟
- 注重味道搭配和烹饪技巧
- 步骤清晰详细`,
    hell: `
【地狱模式规则】
- 冰箱里有什么就用什么，绝不去超市
- 食材搭配可以非常创意、疯狂
- 步骤可以复杂，但必须可行
- 调料只列出用户拥有的，缺失的也要列出并吐槽
- 用幽默、毒舌的语气吐槽这个食谱有多离谱
- 难度自动标记为"地狱"
- 菜名可以搞笑、黑暗料理风格`,
  };

  const prefString = buildPrefString(prefs, lang);

  return `你是一个智能冰箱食谱生成AI，名字叫"冰箱侠"。你的任务是根据用户冰箱里的食材生成一个食谱。

【语言要求】
你必须用${outputLang}回复所有内容，包括JSON内的文本字段。

${modeInstructions[mode] || modeInstructions.lazy}

${prefString}

【输出格式要求】
你必须只返回一个严格的JSON对象，不要带任何额外的文字、代码块标记或解释。JSON格式如下：
{
  "name": "菜名",
  "time": "烹饪时间（数字+单位）",
  "difficulty": "简单/中等/困难/地狱",
  "steps": ["步骤1", "步骤2", ...],
  "missingSeasonings": ["缺失调料1", "缺失调料2", ...],
  "roast": "对这道菜的吐槽或点评（幽默一点）"
}

注意：
- missingSeasonings只列确实需要但用户没有的调料。基本调料（盐、酱油、醋、油）如果用户没说有，懒人模式也不列。
- roast必须用${outputLang}写，要有趣幽默。
- 如果模式是地狱，roast要更毒舌更有趣。`;
}

function buildPrefString(prefs, lang) {
  const parts = [];
  const t = (zh, en, jp) => {
    if (lang === 'en') return en;
    if (lang === 'jp') return jp;
    return zh;
  };

  if (prefs.servings && prefs.servings > 1) {
    parts.push(t(
      `- 用餐人数：${prefs.servings}人，请调整食材用量`,
      `- Servings: ${prefs.servings} people, adjust ingredient quantities accordingly`,
      `- 人数：${prefs.servings}人、分量を調整してください`
    ));
  }

  if (prefs.dietary?.length) {
    parts.push(t(
      `- 忌口/过敏：${prefs.dietary.join('、')}，绝对不能使用这些食材`,
      `- Dietary restrictions: ${prefs.dietary.join(', ')}, absolutely avoid these`,
      `- 食事制限：${prefs.dietary.join('、')}、絶対に使用しないでください`
    ));
  }

  if (prefs.taste) {
    parts.push(t(
      `- 口味偏好：${prefs.taste}`,
      `- Taste preference: ${prefs.taste}`,
      `- 味の好み：${prefs.taste}`
    ));
  }

  if (prefs.tools?.length) {
    parts.push(t(
      `- 可用工具：${prefs.tools.join('、')}，尽量只使用这些工具`,
      `- Available tools: ${prefs.tools.join(', ')}, use only these`,
      `- 使用可能な調理器具：${prefs.tools.join('、')}、これらだけを使用`
    ));
  }

  return parts.length > 0 ? `【用户偏好】\n${parts.join('\n')}` : '';
}

/**
 * Stream DeepSeek API response
 * @param {string} ingredients - comma-separated ingredients
 * @param {string} mode - 'lazy' | 'hardcore' | 'hell'
 * @param {string} lang - 'zh' | 'en' | 'jp'
 * @param {object} prefs - preferences object
 * @param {function} onChunk - called with each text chunk
 * @param {function} onDone - called when complete with full text
 * @param {function} onError - called on error with error message
 * @param {AbortSignal} [signal] - optional abort signal
 */
export async function streamRecipe(ingredients, mode, lang, prefs, onChunk, onDone, onError, signal) {
  const systemPrompt = buildSystemPrompt(mode, lang, prefs);

  const userMessageMap = {
    zh: `我的冰箱里有这些食材：${ingredients}`,
    en: `I have these ingredients in my fridge: ${ingredients}`,
    jp: `冷蔵庫にこれらの食材があります：${ingredients}`,
  };
  const userMessage = userMessageMap[lang] || userMessageMap.zh;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        stream: true,
        temperature: mode === 'hell' ? 1.2 : 0.8,
        max_tokens: 2048,
      }),
      signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API error ${response.status}: ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            onDone(fullText);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(content, fullText);
            }
          } catch (e) {
            // skip parse errors for incomplete chunks
          }
        }
      }
    }
    onDone(fullText);
  } catch (error) {
    if (error.name === 'AbortError') {
      onError('Request was cancelled');
    } else {
      onError(error.message || 'Unknown error');
    }
  }
}

/**
 * Parse recipe JSON from streaming text
 * Handles partial and complete JSON
 */
export function parseRecipeJSON(text) {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from markdown code blocks or surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        // ignore
      }
    }
  }
  return null;
}

/**
 * Non-streaming fallback (not used by default, kept for reference)
 */
export async function generateRecipe(ingredients, mode, lang, prefs) {
  const systemPrompt = buildSystemPrompt(mode, lang, prefs);
  const userMessageMap = {
    zh: `我的冰箱里有这些食材：${ingredients}`,
    en: `I have these ingredients in my fridge: ${ingredients}`,
    jp: `冷蔵庫にこれらの食材があります：${ingredients}`,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessageMap[lang] || userMessageMap.zh },
      ],
      stream: false,
      temperature: mode === 'hell' ? 1.2 : 0.8,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return parseRecipeJSON(content);
}
