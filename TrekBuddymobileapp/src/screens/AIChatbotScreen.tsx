import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../theme/spacing';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Groq API call — uses EXPO_PUBLIC_GROQ_API_KEY from .env
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';

const callGroqAPI = async (
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  if (!GROQ_API_KEY) {
    return 'Groq API key not found. Please check your .env file (EXPO_PUBLIC_GROQ_API_KEY).';
  }

  const systemPrompt = `You are a friendly and knowledgeable travel guide for Pondicherry (Puducherry), India.
You help tourists with travel planning, places to visit, food recommendations, cultural tips, transport, hotels, and local experiences.
Keep answers concise (2-4 sentences), warm, and helpful. If asked anything unrelated to Pondicherry or travel, gently redirect to your specialty.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: question },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => 'Unknown error');
    throw new Error(`Groq API error ${response.status}: ${err.slice(0, 120)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response. Please try again.';
};

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  loading?: boolean;
}

const QUICK_QUESTIONS = [
  '🏖️ Best beaches in Pondy?',
  '🍽️ Top restaurants?',
  '🛕 Famous temples?',
  '🎒 2-day itinerary?',
  '🚗 How to get around?',
];

interface AIChatbotScreenProps {
  navigation?: any;
}

export default function AIChatbotScreen({ navigation }: AIChatbotScreenProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const question = text.trim();
    if (!question || isLoading) return;

    setInput('');
    Keyboard.dismiss();

    // Add user message
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: question,
    };

    // Add AI loading placeholder
    const aiMsgId = `a_${Date.now()}`;
    const aiMsgLoading: Message = {
      id: aiMsgId,
      role: 'ai',
      text: '',
      loading: true,
    };

    setMessages(prev => [...prev, userMsg, aiMsgLoading]);
    setIsLoading(true);
    scrollToBottom();

    try {
      // Build conversation history in Groq/OpenAI format
      const history = messages
        .filter(m => !m.loading && m.text)
        .slice(-8)
        .map(m => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));

      const answer = await callGroqAPI(question, history);

      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId ? { ...m, text: answer, loading: false } : m
        )
      );
    } catch (error: any) {
      const errText =
        error?.message?.includes('API key') || error?.message?.includes('not found')
          ? '⚙️ Groq API key missing in .env file.'
          : error?.message?.includes('Network') || error?.message?.includes('fetch')
            ? '📵 No internet connection. Please try again.'
            : error?.message?.includes('401') || error?.message?.includes('invalid')
              ? '🔑 Invalid Groq API key. Check your .env file.'
              : '😕 Something went wrong. Please try again.';

      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId ? { ...m, text: errText, loading: false } : m
        )
      );
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [isLoading, messages, scrollToBottom]);

  const handleQuickQuestion = (q: string) => {
    const stripped = q.replace(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\uFE0F\s]+/u, '').trim();
    sendMessage(stripped || q);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAI]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <LinearGradient colors={['#0891b2', '#06b6d4']} style={styles.aiAvatarGrad}>
              <Text style={styles.aiAvatarText}>✦</Text>
            </LinearGradient>
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          {item.loading ? (
            <View style={styles.dots}>
              <ActivityIndicator size="small" color="#0891b2" />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          ) : (
            <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <LinearGradient colors={['#e0f2fe', '#f0f9ff']} style={styles.emptyIcon}>
        <Text style={{ fontSize: 40 }}>✦</Text>
      </LinearGradient>
      <Text style={styles.emptyTitle}>Pondy AI Assistant</Text>
      <Text style={styles.emptySubtitle}>
        Ask me anything about{'\n'}Puducherry — places, food, culture & more!
      </Text>

      <View style={styles.quickChipsWrap}>
        {QUICK_QUESTIONS.map((q, i) => (
          <TouchableOpacity
            key={i}
            style={styles.quickChip}
            onPress={() => handleQuickQuestion(q)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickChipText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <LinearGradient colors={['#0891b2', '#06b6d4']} style={styles.headerAvatar}>
            <Text style={{ fontSize: 18 }}>✦</Text>
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>Pondy AI</Text>
            <Text style={styles.headerSub}>
              {isLoading ? '● Responding...' : '● Online'}
            </Text>
          </View>
        </View>

        {messages.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setMessages([])}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat + Input inside KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && styles.listEmpty,
          ]}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          {/* Quick suggestions when no messages */}
          {messages.length === 0 && null}

          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Ask about Puducherry..."
              placeholderTextColor="#94a3b8"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              editable={!isLoading}
              onSubmitEditing={() => sendMessage(input)}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!input.trim() || isLoading) && styles.sendBtnDisabled,
              ]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  !input.trim() || isLoading
                    ? ['#e2e8f0', '#e2e8f0']
                    : ['#0891b2', '#06b6d4']
                }
                style={styles.sendBtnGrad}
              >
                <Feather
                  name="send"
                  size={16}
                  color={!input.trim() || isLoading ? '#94a3b8' : '#fff'}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: STATUSBAR_HEIGHT,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#0891b2',
    fontWeight: '600',
    marginTop: 1,
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chat list
  listContent: {
    padding: 16,
    paddingBottom: 10,
    flexGrow: 1,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  quickChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  quickChipText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },

  // Messages
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAI: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    marginRight: 8,
    marginBottom: 2,
  },
  aiAvatarGrad: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#0891b2',
    borderBottomRightRadius: 4,
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  userText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
    fontWeight: '500',
  },
  aiText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  typingText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },

  // Input Bar
  inputBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 16 : 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: '#0f172a',
    maxHeight: 110,
    minHeight: 42,
  },
  sendBtn: {
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendBtnGrad: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.7,
  },
});
