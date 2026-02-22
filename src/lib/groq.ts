import Groq from 'groq-sdk';

const getGroqClient = () => {
    const key = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || '';
    console.log("[GroqService] Full ENV keys available:", Object.keys(process.env).filter(k => k.includes('GROQ')));
    if (!key) {
        console.warn("[GroqService] Warning: Groq API Key is not set in process.env!");
    } else {
        console.log(`[GroqService] Loaded API Key: ${key.substring(0, 8)}...${key.substring(key.length - 4)} (Length: ${key.length})`);
    }
    return new Groq({
        apiKey: key,
        dangerouslyAllowBrowser: true
    });
};

const groq = getGroqClient();

export class GroqService {
    private model: string;
    private client: Groq;

    constructor(modelName: string = 'llama-3.3-70b-versatile') {
        this.model = modelName;
        this.client = groq;
    }

    private getClient() {
        // Force refresh the client if the key wasn't loaded previously
        if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
            return getGroqClient();
        }
        return this.client;
    }

    async generateResponse(prompt: string, systemInstruction?: string): Promise<string> {
        try {
            const messages: any[] = [];
            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }
            messages.push({ role: 'user', content: prompt });

            const chatCompletion = await this.getClient().chat.completions.create({
                messages: messages,
                model: this.model,
                temperature: 0.7,
                max_tokens: 2048,
            });

            return chatCompletion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Groq API Error:', error);
            throw error;
        }
    }

    async generateJSON(prompt: string, systemInstruction?: string): Promise<string> {
        try {
            const messages: any[] = [];
            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }
            messages.push({ role: 'user', content: prompt });

            const chatCompletion = await this.getClient().chat.completions.create({
                messages: messages,
                model: this.model,
                temperature: 0.2, // Lower temperature for more deterministic JSON
                max_tokens: 4096, // Higher token limit for long JSON
                response_format: { type: "json_object" }
            });

            return chatCompletion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Groq JSON API Error:', error);
            throw error;
        }
    }

    async *generateResponseStream(prompt: string, systemInstruction?: string) {
        try {
            const messages: any[] = [];
            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }
            messages.push({ role: 'user', content: prompt });

            const stream = await this.getClient().chat.completions.create({
                messages: messages,
                model: this.model,
                temperature: 0.7,
                max_tokens: 1024,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    yield content;
                }
            }
        } catch (error) {
            console.error('Groq Streaming Error:', error);
            throw error;
        }
    }

    async checkConnection(): Promise<boolean> {
        try {
            await this.generateResponse('Hello', 'Test');
            return true;
        } catch (error) {
            console.error('Groq Connection Check Failed:', error);
            return false;
        }
    }
}

export const groqService = new GroqService();
