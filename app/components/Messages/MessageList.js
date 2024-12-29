import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth } = Dimensions.get('window');

export default function MessageList({ messages, handleDeleteMessage, handleOpenMessage }) {
  const auth = getAuth();
  const currentUser = auth.currentUser || { email: '' };
  const soundRef = useRef(null);
  const previousMessagesLength = useRef(messages.length);
  const previousMessages = useRef(messages);
  const sectionListRef = useRef(null);
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
      // Scroll to the last message when new messages are received
      if (sectionListRef.current) {
        sectionListRef.current.scrollToLocation({
          sectionIndex: sortedMessages.length - 1,
          itemIndex: sortedMessages[sortedMessages.length - 1].data.length - 1,
          animated: true,
        });
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
        <TouchableOpacity
          onPress={() => !isSentByCurrentUser && handleOpenMessage(item.id)}
          onLongPress={() => handleDeleteMessage(item.id)}
          style={[
            styles.messageBubble,
            isSentByCurrentUser ? userMessageStyle(colorScheme) : receivedMessageStyle(colorScheme),
            isSentByCurrentUser
              ? { borderBottomRightRadius: 0, borderBottomLeftRadius: 18 }
              : { borderTopLeftRadius: 0, borderBottomLeftRadius: 18 },
          ]}
        >
          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageText,
                isSentByCurrentUser ? styles.userMessageText : receivedMessageTextStyle(colorScheme),
              ]}
            >
              {messageText}
            </Text>
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

  const getItemLayout = (data, index) => {
    const itemHeight = 60; // Adjust this value based on your item height
    const sectionHeaderHeight = 30; // Adjust this value based on your section header height
    const offset = index * itemHeight + Math.floor(index / data.length) * sectionHeaderHeight;
    return { length: itemHeight, offset, index };
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'} />
      <SectionList
        ref={sectionListRef}
        sections={sortedMessages}
        renderItem={renderMessage}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            sectionListRef.current?.scrollToLocation({
              sectionIndex: info.index.sectionIndex,
              itemIndex: info.index.itemIndex,
              animated: true,
            });
          });
        }}
      />
    </KeyboardAvoidingView>
  );
}

const userMessageStyle = (colorScheme) => ({
  backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_SECONDARY,
  borderRadius: 18,
  padding: 8, // Reduced padding
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
});

const receivedMessageStyle = (colorScheme) => ({
  backgroundColor: colorScheme === 'light' ? '#ffffff' : '#333333', // Adjusted color for dark mode
  borderColor: colorScheme === 'light' ? '#ddd' : '#444444', // Adjusted border color for dark mode
  borderWidth: 1,
  borderRadius: 18,
  padding: 8, // Reduced padding
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
});

const receivedMessageTextStyle = (colorScheme) => ({
  color: colorScheme === 'light' ? '#444' : '#ccc', // Darker color for light mode, lighter color for dark mode
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
    marginVertical: 4, // Reduced margin to decrease spacing between messages
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '100%',
    paddingHorizontal: 8, // Reduced padding
  },
  messageBubble: {
    padding: 8, // Reduced padding
    borderRadius: 18,
    maxWidth: '85%',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  receivedMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    flexDirection: 'column',
  },
  messageText: {
    fontSize: screenWidth * 0.03, // Reduced font size
    fontFamily: 'Poppins-Medium',
    lineHeight: 18, // Reduced line height
    flexShrink: 1, // Ensure text shrinks if necessary
  },
  userMessageText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3, // Reduced margin
  },
  messageTime: {
    fontSize: 8, // Reduced font size
    marginTop: 2, // Reduced margin
    fontFamily: 'Poppins',
    alignSelf: 'flex-end', // Align to the right
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
});