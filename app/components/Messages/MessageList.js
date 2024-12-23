import React from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function MessageList({ messages, handleDeleteMessage, handleOpenMessage }) {
  const auth = getAuth();
  const currentUser = auth.currentUser || { email: '' };

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
          style={[styles.messageBubble, isSentByCurrentUser ? styles.userMessage : styles.receivedMessage]}
        >
          <Text
            style={[
              styles.messageText,
              isSentByCurrentUser ? styles.userMessageText : styles.receivedMessageText,
            ]}
          >
            {messageText}
          </Text>
        </TouchableOpacity>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTime,
              isSentByCurrentUser ? styles.userMessageTime : styles.receivedMessageTime,
            ]}
          >
            {item.timestamp}
          </Text>
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

  const sections = Object.keys(groupedMessages).map((date) => ({
    title: date,
    data: groupedMessages[date],
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SectionList
        sections={sections}
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
    paddingBottom: 60,
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
    marginVertical: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: 15,
    
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
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
  },
  receivedMessage: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  messageText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
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
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    marginHorizontal: 5,
  },
  userMessageTime: {
    alignSelf: 'flex-end',
  },
  receivedMessageTime: {
    alignSelf: 'flex-start',
  },
  checkMarks: {
    marginLeft: 5,
  },
});