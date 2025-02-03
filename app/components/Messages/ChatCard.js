import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useColorScheme } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ChatCard({ chat }) {
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const chatId = [currentUser.email, chat.email].sort().join('_'); // Unique chat ID for the pair of users

  const [lastMessage, setLastMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const db = getFirestore();
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
    const unreadMessagesQuery = query(messagesRef, where('receivedByUser', '==', currentUser.email), where('unread', '==', true));

    const unsubscribeLastMessage = onSnapshot(lastMessageQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const message = querySnapshot.docs[0].data();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLastMessage({
          ...message,
          timestamp: formatTimestamp(message.timestamp.toDate()),
        });
      } else {
        setLastMessage(null);
      }
    });

    const unsubscribeUnreadMessages = onSnapshot(unreadMessagesQuery, (querySnapshot) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUnreadCount(querySnapshot.size);
    });

    return () => {
      unsubscribeLastMessage();
      unsubscribeUnreadMessages();
    };
  }, [chatId, currentUser.email]);

  const handlePress = async () => {
    const db = getFirestore();
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const unreadMessagesQuery = query(messagesRef, where('receivedByUser', '==', currentUser.email), where('unread', '==', true));
    const querySnapshot = await getDocs(unreadMessagesQuery);

    querySnapshot.forEach(async (docSnapshot) => {
      const messageRef = doc(db, 'chats', chatId, 'messages', docSnapshot.id);
      await updateDoc(messageRef, { unread: false });
    });

    navigation.navigate('ChatPage', {
      chat: { ...chat, id: chatId },
      realTimestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  const formatName = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 2) {
      return `${nameParts[0]} ${nameParts[1]}`;
    }
    return name;
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };

  const themeBackgroundColor = colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY;
  const themeBorderColor = colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_BORDER;
  const themeTextColor = colorScheme === 'light' ? '#000' : Colors.WHITE;
  const themeTimeColor = colorScheme === 'light' ? '#888' : Colors.DARK_TEXT;
  const themeMessagePreviewColor = colorScheme === 'light' ? '#888' : Colors.DARK_TEXT;
  const themeUnreadMessageColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;
  const themeBadgeBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;
  const themeBadgeTextColor = colorScheme === 'light' ? '#fff' : '#000';

  return (
    <TouchableOpacity style={[styles.cardContainer, { backgroundColor: themeBackgroundColor, borderBottomColor: themeBorderColor, shadowColor: colorScheme === 'light' ? '#ccc' : 'transparent' }]} onPress={handlePress}>
      <Image source={{ uri: chat.profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: themeTextColor }]}>{formatName(chat.name)}</Text>
          <Text style={[styles.time, { color: themeTimeColor }]}>{lastMessage ? lastMessage.timestamp : ''}</Text>
        </View>
        <Text
          style={[
            styles.messagePreview,
            { color: themeMessagePreviewColor },
            lastMessage && lastMessage.receivedByUser === currentUser.email && lastMessage.unread
              ? { color: themeUnreadMessageColor, fontFamily: 'Poppins-Medium' }
              : null,
          ]}
          numberOfLines={1} // Limit the number of lines to 1
          ellipsizeMode="tail" // Add ellipsis at the end if the text is too long
        >
          {lastMessage
            ? truncateText(lastMessage.text, 30) // Truncate the message text to 30 characters
            : 'Select chat to start messaging'}
        </Text>
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: themeBadgeBackgroundColor }]}>
            <Text style={[styles.badgeText, { color: themeBadgeTextColor }]}>{unreadCount}</Text>
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
    padding: 10, // Reduced padding to decrease gap between messages
    borderBottomWidth: 1,
    marginVertical: 3, // Reduced margin to decrease gap between messages
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, // Reduced margin to decrease gap between image and text
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
    fontFamily: 'Poppins-Medium',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  messagePreview: {
    fontSize: 14,
    marginTop: 3, // Reduced margin to decrease gap between name and message preview
    fontFamily: 'Poppins',
  },
  unreadMessage: {
    fontFamily: 'Poppins-Medium',
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: 30,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
  },
});