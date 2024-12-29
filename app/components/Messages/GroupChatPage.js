import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Colors from '../../../assets/Utils/Colors';
import GroupInputSection from './GroupInputSection';
import GroupMessageList from './GroupMessageList';
import GroupChatHeader from './GroupChatHeader';
import { useColorScheme } from 'react-native';

export default function GroupChatPage({ route, navigation }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const colorScheme = useColorScheme();

  useEffect(() => {
    const db = getFirestore();
    const messagesRef = collection(db, 'groupChats', chat.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chat.id]);

  const handleSend = async (type) => {
    if (newMessage.trim() === '') return;

    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    const messagesRef = collection(db, 'groupChats', chat.id, 'messages');
    const messageData = {
      text: newMessage,
      sentByUser: currentUser.email,
      senderAvatar: userData.avatar || 'https://img.freepik.com/premium-vector/logo-kid-gamer_573604-742.jpg', // Ensure a default avatar URL if none is provided
      timestamp: new Date().toISOString(), // Ensure timestamp is properly formatted
    };

    try {
      await addDoc(messagesRef, messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
      <GroupChatHeader group={chat} navigation={navigation} />
      <GroupMessageList
        messages={messages}
        handleDeleteMessage={(id) => console.log(`Delete message with id: ${id}`)}
        handleOpenMessage={(id) => console.log(`Open message with id: ${id}`)}
      />
      <GroupInputSection
        message={newMessage}
        setMessage={setNewMessage}
        handleSend={handleSend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});