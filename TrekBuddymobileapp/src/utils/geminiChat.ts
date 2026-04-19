import { getGeminiApiKey } from './storage';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface ChatMessage {
  question: string;
  answer: string;
  timestamp: string;
}

/**
 * Get AI response from Gemini for chat
 */
export const getGeminiChatResponse = async (question: string): Promise<string> => {
  try {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      return 'Please set your Gemini API key in settings to use the AI assistant.';
    }

    const prompt = `You are a friendly travel assistant for Pondicherry, India. Answer the user's question about travel, places, food, culture, or tourism in a helpful and concise way (2-3 sentences). Be conversational and friendly.

User question: ${question}

Provide a helpful answer:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Network error');
      if (response.status === 0 || errorText.includes('Failed to fetch')) {
        throw new Error('Network error: Please check your internet connection');
      }
      throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return generatedText.trim() || 'I apologize, but I couldn\'t generate a response. Please try again.';
  } catch (error) {
    console.error('Error getting Gemini chat response:', error);
    return 'Sorry, I encountered an error. Please check your API key and try again.';
  }
};

