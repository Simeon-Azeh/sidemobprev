import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const { width: screenWidth } = Dimensions.get('window');

export default function MessageList({ messages, handleDeleteMessage, handleOpenMessage }) {
  const auth = getAuth();
  const currentUser = auth.currentUser || { email: '' };
  const soundRef = useRef(null);
  const previousMessagesLength = useRef(messages.length);
  const previousMessages = useRef(messages);

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/sounds/notification.mp3.mp3')
      );
      soundRef.current = sound;
      await sound.playAsync();
    };

    if (messages.length > previousMessagesLength.current) {
      const newMessages = messages.slice(previousMessagesLength.current);
      const receivedMessages = newMessages.filter(msg => msg.sentByUser !== currentUser.email);
      if (receivedMessages.length > 0) {
        playSound();
      }
    }

    previousMessagesLength.current = messages.length;
    previousMessages.current = messages;

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [messages, currentUser.email]);

  const formatDate = (timestamp) => {
    const datePart = timestamp.split(' at ')[0];
    const date = new Date(datePart);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const date = formatDate(message.timestamp);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  const sortedMessages = Object.keys(groupedMessages).sort((a, b) => new Date(b) - new Date(a)).map(date => ({
    title: date,
    data: groupedMessages[date],
  }));

  const renderMessage = ({ item }) => {
    const isSentByCurrentUser = item.sentByUser === currentUser.email;
    const messageText = item.text || 'Message not available';

    const renderCheckMarks = () => {
      if (isSentByCurrentUser) {
        return (
          <View style={styles.checkMarks}>
            <Ionicons
              name={item.unread ? 'checkmark-outline' : 'checkmark-done-outline'}
              size={14}
              color={Colors.SECONDARY}
            />
          </View>
        );
      }
      return null;
    };

    return (
      <View
        style={[
          styles.messageContainer,
          isSentByCurrentUser ? styles.userMessageContainer : styles.receivedMessageContainer,
        ]}
      >
        <TouchableOpacity
          onPress={() => !isSentByCurrentUser && handleOpenMessage(item.id)}
          onLongPress={() => handleDeleteMessage(item.id)}
          style={[
            styles.messageBubble,
            isSentByCurrentUser ? styles.userMessage : styles.receivedMessage,
            isSentByCurrentUser
              ? { borderBottomRightRadius: 0, borderBottomLeftRadius: 18 }
              : { borderTopLeftRadius: 0, borderBottomLeftRadius: 18 },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSentByCurrentUser ? styles.userMessageText : styles.receivedMessageText,
            ]}
          >
            {messageText}
          </Text>
          <Text
            style={[
              styles.messageTimeInBubble,
              isSentByCurrentUser ? styles.userMessageTimeInBubble : styles.receivedMessageTimeInBubble,
            ]}
          >
            {item.timestamp}
          </Text>
        </TouchableOpacity>
        <View style={styles.messageFooter}>
          {renderCheckMarks()}
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SectionList
        sections={sortedMessages}
        renderItem={renderMessage}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatList: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  messageContainer: {
    marginVertical: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  userMessage: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  messageText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#444',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  messageTime: {
    fontSize: 9,
    color: '#888',
    marginHorizontal: 5,
    fontFamily: 'Poppins',
  },
  userMessageTime: {
    alignSelf: 'flex-end',
  },
  receivedMessageTime: {
    alignSelf: 'flex-start',
  },
  messageTimeInBubble: {
    fontSize: 9,
    marginTop: 5,
  },
  userMessageTimeInBubble: {
    color: '#fff',
    alignSelf: 'flex-end',
  },
  receivedMessageTimeInBubble: {
    color: '#888',
    alignSelf: 'flex-start',
  },
  checkMarks: {
    marginLeft: 5,
  },
});