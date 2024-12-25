import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputSection from './InputSection';
import EmojiPicker from './EmojiPicker';
import * as DocumentPicker from 'expo-document-picker';
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export default function ChatPage({ route }) {
  const { chat, realTimestamp } = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const chatId = [currentUser.email, chat.email].sort().join('_'); // Unique chat ID for the pair of users
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? new Date(data.timestamp.seconds * 1000).toISOString() : '',
        };
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chat.email]);

  const handleSend = async () => {
    if (message.trim()) {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore();
      const chatId = [currentUser.email, chat.email].sort().join('_'); // Unique chat ID for the pair of users
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: message,
        sentByUser: currentUser.email,
        receivedByUser: chat.email,
        timestamp: Timestamp.now(),
        unread: true, // Add unread field
      });
      setMessage('');
    }
  };

  const handleDeleteMessage = (messageId) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => setMessages(messages.filter(message => message.id !== messageId)) },
      ],
      { cancelable: true }
    );
  };

  const handleFileAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        console.log('File picked:', result);
      } else if (result.type === 'cancel') {
        console.log('User canceled the picker');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
    setShowEmojiPicker(false);
  };

  const handleOpenMessage = async (messageId) => {
    const db = getFirestore();
    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    await updateDoc(messageRef, {
      unread: false,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Adjust offset based on header height
    >
      <ChatHeader chat={chat} realTimestamp={realTimestamp} />
      <MessageList messages={messages} handleDeleteMessage={handleDeleteMessage} handleOpenMessage={handleOpenMessage} />
      <InputSection
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        handleFileAttachment={handleFileAttachment}
        setShowEmojiPicker={setShowEmojiPicker}
      />
      {showEmojiPicker && <EmojiPicker handleEmojiSelect={handleEmojiSelect} />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: 40,
  },
});
