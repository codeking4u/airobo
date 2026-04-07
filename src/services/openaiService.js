import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

let client = null;

export const initializeOpenAI = () => {
  if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
    client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      timeout: 10000,       // 10s timeout – don't hang forever
      maxRetries: 1,        // One retry max
    });
    return true;
  } else {
    console.warn('[Looi] OpenAI API key missing or placeholder');
    return false;
  }
};

export const getAIResponse = async (userMessage, conversationHistory) => {
  if (!client) {
    if (!initializeOpenAI()) {
      throw new Error('OpenAI API key not configured');
    }
  }

  const messages = [
    {
      role: 'system',
      content: 'You are Looi Robo, a friendly and cheerful animated avatar. Keep responses brief (1-2 sentences), conversational, and fun. Use casual language.',
    },
    ...conversationHistory.slice(-10), // Only keep last 10 messages to avoid token overflow
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 100,
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (error) {
    const status = error?.status || error?.response?.status;
    if (status === 401) {
      console.error('[Looi] Invalid API key');
    } else if (status === 429) {
      console.error('[Looi] Rate limited or no credits');
    } else if (status === 402) {
      console.error('[Looi] No credits – billing needed');
    }
    console.error('[Looi] OpenAI error:', error?.message || error);
    throw error;
  }
};
