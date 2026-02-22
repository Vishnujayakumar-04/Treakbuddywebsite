
import { AIProvider } from './types';
import { groqService } from '@/lib/groq';

// Groq-based AI Provider wrapper
class GroqAIProvider implements AIProvider {
    async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
        return groqService.generateResponse(prompt, systemPrompt);
    }

    async checkConnection(): Promise<boolean> {
        return groqService.checkConnection();
    }
}

const aiService: AIProvider = new GroqAIProvider();

export { aiService };
