import { taxExamples } from './taxExamples';

import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    const systemMessage = {
      role: 'system',
      content: `You are an expert assistant specialized in tax law and tax-related topics. 
      You are only allowed to answer questions related to taxes. 
      If the user asks anything unrelated to taxes, politely refuse and say: 
      "I'm sorry, I can only assist with tax-related questions." 
      Always reply in English.`,
      };

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-chat',
          messages: [systemMessage,...taxExamples,userMsg]
        },
        {
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost',
            'X-Title': 'My React Native App',
          },
        }
      );
      

      const botResponse = response.data.choices[0].message;
      setMessages([...newMessages, botResponse]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages([...newMessages, { role: 'assistant', content: 'An error occurred. Try again.' }]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7ff',
  },
  messagesContainer: {
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#7e5bef',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2d6ff',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#7e5bef',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});
