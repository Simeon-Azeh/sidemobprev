import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';

export default function ChatCard({ chat }) {
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const chatId = [currentUser.email, chat.email].sort().join('_'); // Unique chat ID for the pair of users

  const [lastMessage, setLastMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const db = getFirestore();
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
    const unreadMessagesQuery = query(messagesRef, where('receivedByUser', '==', currentUser.email), where('opened', '==', false));

    const unsubscribeLastMessage = onSnapshot(lastMessageQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const message = querySnapshot.docs[0].data();
        setLastMessage({
          ...message,
          timestamp: message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        setLastMessage(null);
      }
    });

    const unsubscribeUnreadMessages = onSnapshot(unreadMessagesQuery, (querySnapshot) => {
      setUnreadCount(querySnapshot.size);
    });

    return () => {
      unsubscribeLastMessage();
      unsubscribeUnreadMessages();
    };
  }, [chatId, currentUser.email]);

  const handlePress = () => {
    navigation.navigate('ChatPage', {
      chat: { ...chat, id: chatId },
      realTimestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Image source={{ uri: chat.profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{chat.name}</Text>
          <Text style={styles.time}>{lastMessage ? lastMessage.timestamp : ''}</Text>
        </View>
        <Text
          style={[
            styles.messagePreview,
            lastMessage && lastMessage.receivedByUser === currentUser.email && !lastMessage.opened
              ? styles.unreadMessage
              : null,
          ]}
        >
          {lastMessage
            ? `${lastMessage.text.slice(0, 20)}${lastMessage.text.length > 20 ? '...' : ''}`
            : 'Select chat to start messaging'}
        </Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
  time: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins',
  },
  messagePreview: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    fontFamily: 'Poppins',
  },
  unreadMessage: {
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: 30,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
});