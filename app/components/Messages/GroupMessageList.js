import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Image, StatusBar } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function GroupMessageList({ messages, handleDeleteMessage, handleOpenMessage }) {
  const auth = getAuth();
  const currentUser = auth.currentUser || { email: '' };
  const soundRef = useRef(null);
  const previousMessagesLength = useRef(messages.length);
  const previousMessages = useRef(messages);
  const colorScheme = useColorScheme();

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
    if (!timestamp) return '';
    const date = new Date(timestamp);
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
        {!isSentByCurrentUser && (
          <View style={styles.senderInfo}>
            <Image source={{ uri: item.senderAvatar }} style={styles.senderAvatar} />
            <Text style={styles.senderName}>{item.sentByUser.split('@')[0]}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => !isSentByCurrentUser && handleOpenMessage(item.id)}
          onLongPress={() => handleDeleteMessage(item.id)}
          style={[
            styles.messageBubble,
            isSentByCurrentUser ? userMessageStyle(colorScheme) : styles.receivedMessage,
            isSentByCurrentUser
              ? { borderBottomRightRadius: 0, borderBottomLeftRadius: 18 }
              : { borderTopLeftRadius: 0, borderBottomLeftRadius: 18 },
          ]}
        >
          <View style={styles.messageContentRow}>
            <Text
              style={[
                styles.messageText,
                isSentByCurrentUser ? styles.userMessageText : styles.receivedMessageText,
              ]}
            >
              {messageText}
            </Text>
            <View style={{ width: 8 }} />
            <Text
              style={[
                styles.messageTime,
                isSentByCurrentUser ? styles.userMessageTime : styles.receivedMessageTime,
              ]}
            >
              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.messageFooter}>
          {renderCheckMarks()}
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.line} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <View style={styles.line} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'} />
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

const userMessageStyle = (colorScheme) => ({
  backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_SECONDARY,
  borderRadius: 18,
  padding: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
});

const styles = StyleSheet.create({
  chatList: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  messageContainer: {
    marginVertical: 2,
    flexDirection: 'column', // Changed to column to stack name on top of message
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
  messageContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    marginRight: 8,
    fontFamily: 'Poppins',
    marginTop: 5,
  },
  userMessageTime: {
    color: '#fff',
  },
  receivedMessageTime: {
    color: '#888',
  },
  checkMarks: {
    marginLeft: 5,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  senderName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#444',
  },
});