import { AIProvider } from '../types';

export class OpenAIProvider implements AIProvider {
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
        try {
            const messages = [
                { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
            ];

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error("OpenAI Provider Error:", error);
            throw error;
        }
    }

    async checkConnection(): Promise<boolean> {
        // Minimal valid request to check API key
        try {
            await this.generateResponse('Hello', 'Test');
            return true;
        } catch (error) {
            return false;
        }
    }
}
