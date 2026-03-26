import { getAIResponse } from '../src/services/chatService';

// Mock the global fetch
global.fetch = jest.fn();

describe('chatService', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('should return a quick reply for "beach" without calling the API', async () => {
        const response = await getAIResponse('What is the best beach in Pondy?');
        expect(response).toContain('Promenade Beach');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return a quick reply for "restaurant"', async () => {
        const response = await getAIResponse('Can you suggest a restaurant?');
        expect(response).toContain('Villa Shanti');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should call the API for generic questions', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ response: 'Puducherry is a Union Territory.' })
        });
        
        const response = await getAIResponse('Tell me about the history of the town.');
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response).toBe('Puducherry is a Union Territory.');
    });

    it('should handle API errors gracefully', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Failure'));
        
        const response = await getAIResponse('This is going to fail.');
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(response).toContain('having trouble connecting');
    });
});
