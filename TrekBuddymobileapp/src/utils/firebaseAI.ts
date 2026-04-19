import { getGeminiApiKey } from './storage';
import { db } from '../firebase/firestore';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  where,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, getUserSubcollectionPath } from '../firebase/firestoreStructure';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  createdAt: Timestamp | string;
  userId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

/**
 * Get AI response from Gemini API
 * This can be replaced with Firebase Functions for server-side processing
 */
export const getAIResponse = async (
  question: string,
  context?: {
    userId?: string;
    conversationHistory?: ChatMessage[];
  }
): Promise<string> => {
  try {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      return 'Please set your Gemini API key in settings to use the AI assistant.';
    }

    // Build context from conversation history
    let contextPrompt = '';
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory.slice(-5); // Last 5 messages
      contextPrompt = '\n\nPrevious conversation:\n';
      recentHistory.forEach(msg => {
        contextPrompt += `User: ${msg.question}\nAssistant: ${msg.answer}\n\n`;
      });
    }

    const prompt = `You are a friendly travel assistant for Pondicherry, India. Answer the user's question about travel, places, food, culture, or tourism in a helpful and concise way (2-3 sentences). Be conversational and friendly.

User question: ${question}${contextPrompt}

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
  } catch (error: any) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};

/**
 * Save chat message to Firestore
 */
export const saveChatMessage = async (
  userId: string,
  question: string,
  answer: string
): Promise<string> => {
  try {
    const chatsPath = getUserSubcollectionPath(userId, 'chats');
    const chatsRef = collection(db, chatsPath);
    
    const chatDoc = await addDoc(chatsRef, {
      question,
      answer,
      createdAt: serverTimestamp(),
    });
    
    return chatDoc.id;
  } catch (error: any) {
    console.error('Error saving chat message:', error);
    throw new Error(error.message || 'Failed to save chat message');
  }
};

/**
 * Get user's chat history from Firestore
 */
export const getChatHistory = async (
  userId: string,
  limitCount: number = 50
): Promise<ChatMessage[]> => {
  try {
    const chatsPath = getUserSubcollectionPath(userId, 'chats');
    const chatsRef = collection(db, chatsPath);
    const q = query(chatsRef, orderBy('createdAt', 'asc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        question: data.question || '',
        answer: data.answer || '',
        timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        createdAt: data.createdAt,
        userId,
      };
    });
  } catch (error: any) {
    console.error('Error getting chat history:', error);
    throw new Error(error.message || 'Failed to get chat history');
  }
};

/**
 * Get recent chat messages for context
 */
export const getRecentChatMessages = async (
  userId: string,
  count: number = 5
): Promise<ChatMessage[]> => {
  try {
    const chatsPath = getUserSubcollectionPath(userId, 'chats');
    const chatsRef = collection(db, chatsPath);
    const q = query(chatsRef, orderBy('createdAt', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question || '',
          answer: data.answer || '',
          timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: data.createdAt,
          userId,
        };
      })
      .reverse(); // Reverse to get chronological order
  } catch (error: any) {
    console.error('Error getting recent chat messages:', error);
    return [];
  }
};

/**
 * Delete a chat message from Firestore
 */
export const deleteChatMessage = async (
  userId: string,
  messageId: string
): Promise<void> => {
  try {
    const chatsPath = getUserSubcollectionPath(userId, 'chats');
    const messageRef = doc(db, chatsPath, messageId);
    await deleteDoc(messageRef);
  } catch (error: any) {
    console.error('Error deleting chat message:', error);
    throw new Error(error.message || 'Failed to delete chat message');
  }
};

/**
 * Clear all chat history for a user
 */
export const clearChatHistory = async (userId: string): Promise<void> => {
  try {
    const chatsPath = getUserSubcollectionPath(userId, 'chats');
    const chatsRef = collection(db, chatsPath);
    const querySnapshot = await getDocs(chatsRef);
    
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error: any) {
    console.error('Error clearing chat history:', error);
    throw new Error(error.message || 'Failed to clear chat history');
  }
};

/**
 * Send a message to AI assistant and save to Firestore
 * This is the main function to use for AI chat
 */
export const sendAIMessage = async (
  userId: string,
  question: string
): Promise<{ answer: string; messageId: string }> => {
  try {
    // Get recent conversation history for context
    const recentMessages = await getRecentChatMessages(userId, 5);
    
    // Get AI response with context
    const answer = await getAIResponse(question, {
      userId,
      conversationHistory: recentMessages,
    });
    
    // Save to Firestore
    const messageId = await saveChatMessage(userId, question, answer);
    
    return { answer, messageId };
  } catch (error: any) {
    console.error('Error sending AI message:', error);
    throw error;
  }
};

/**
 * Subscribe to chat history changes in real-time
 */
export const subscribeToChatHistory = (
  userId: string,
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  try {
    const chatsPath = getUserSubcollectionPath(userId, 'chats');
    const chatsRef = collection(db, chatsPath);
    const q = query(chatsRef, orderBy('createdAt', 'asc'));
    
    return onSnapshot(
      q,
      (querySnapshot: any) => {
        const messages: ChatMessage[] = querySnapshot.docs.map((doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            question: data.question || '',
            answer: data.answer || '',
            timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            createdAt: data.createdAt,
            userId,
          };
        });
        callback(messages);
      },
      (error: any) => {
        console.error('Error in chat history subscription:', error);
        callback([]);
      }
    );
  } catch (error: any) {
    console.error('Error subscribing to chat history:', error);
    return () => {};
  }
};

