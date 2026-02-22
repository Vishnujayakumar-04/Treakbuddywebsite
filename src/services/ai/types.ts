export interface AIProvider {
    /**
     * Generates a text response from the AI model.
     * @param prompt The user's input message.
     * @param systemPrompt The system context or persona (optional).
     */
    generateResponse(prompt: string, systemPrompt?: string): Promise<string>;

    /**
     * Checks if the AI service is reachable.
     */
    checkConnection(): Promise<boolean>;
}
