import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

let client = null;

export const initializeOpenAI = () => {
  if (OPENAI_API_KEY) {
    client = new OpenAI({ apiKey: OPENAI_API_KEY });
    return true;
  } else {
    console.warn('OpenAI API key not found in .env');
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
      content: 'You are Looi Robo, a friendly and cheerful animated avatar. Keep responses brief (1-2 sentences), conversational, and fun. Use casual language and emojis occasionally.',
    },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 150,
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};
