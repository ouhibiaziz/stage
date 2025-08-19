import { taxExamples } from './taxExamples';
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Image,
  Dimensions
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const ROBOT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{ 
      role: 'assistant', 
      content: "Hello! I'm your AI Tax Assistant. How can I help you with tax-related questions today?" 
    }]);
  }, []);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    const systemPrompt = `You are an expert tax assistant specializing in:
  - Income tax (personal and corporate)
  - Capital gains tax
  - Property tax
  - Sales tax/VAT
  - International taxation
  - Tax deductions and credits
  - Tax filing procedures
  - Tax laws and regulations
  
  You MUST answer all tax-related questions, including:
  - General tax concepts
  - Tax calculations
  - Tax planning
  - Tax compliance
  - Tax-related financial advice
  
  Only refuse questions that are completely unrelated to taxation, finance, or legal matters. 
  For ambiguous questions, ask clarifying questions to determine tax relevance.
  
  Always provide accurate, up-to-date information and clearly state if you're unsure.
  Format responses in clear, organized paragraphs with bullet points when helpful.
    Always reply in English or french or arabic (depends on the language used from the user).`;

    try {
      const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY || 'AIzaSyBBoyBkJpY7jnB8_yPUyn0IRv955Vwwhdk';
      
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set. Please check your configuration.');
      }
      
      const conversationHistory = [
        ...taxExamples.map(example => ({
          role: example.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: example.content }]
        })),
        { role: 'user', parts: [{ text: input }] }
      ];

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            },
            ...conversationHistory
          ],
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_ONLY_HIGH'
            }
          ],
          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 1,
            maxOutputTokens: 2048
          }
        }
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;
      setMessages([...newMessages, { role: 'assistant', content: botResponse }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      let errorMessage = 'An error occurred. Try again.';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = 'Invalid request. Please check your input.';
        } else if (err.response.status === 403) {
          errorMessage = 'Authentication failed. Please check your API key.';
        } else if (err.response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else {
          errorMessage = `API error: ${err.response.status} - ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = err.message;
      }
      
      setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[
              styles.messageRow, 
              item.role === 'user' ? styles.userRow : styles.botRow
            ]}>
              {item.role === 'assistant' && (
                <Image source={{ uri: ROBOT_AVATAR }} style={styles.avatar} />
              )}
              <View style={[
                styles.messageContainer,
                item.role === 'user' ? styles.userContainer : styles.botContainer
              ]}>
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
              {item.role === 'user' && <View style={styles.avatarPlaceholder} />}
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7ff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    width: '100%',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 40, // Same as avatar width + margin
  },
  messageContainer: {
    maxWidth: SCREEN_WIDTH * 0.8, // Takes 80% of screen width
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  botContainer: {
    backgroundColor: '#5d3fd3',
    borderBottomLeftRadius: 4,
  },
  userContainer: {
    backgroundColor: '#7e5bef',
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    color: '#333',
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#7e5bef',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});