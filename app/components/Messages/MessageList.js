import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

export default function MessageList({ messages, handleDeleteMessage, handleOpenMessage }) {
  const auth = getAuth();
  const currentUser = auth.currentUser || { email: '' };

  const renderMessage = ({ item }) => {
    const isSentByCurrentUser = item.sentByUser === currentUser.email;
    const messageText = item.text || 'Message not available';

    // Debugging logs
    console.log('Rendering message:', item.text, 'Sent by:', item.sentByUser, 'Is current user:', isSentByCurrentUser);

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
        <Text
          style={[
            styles.messageTime,
            isSentByCurrentUser ? styles.userMessageTime : styles.receivedMessageTime,
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.chatList}
    />
  );
}

const styles = StyleSheet.create({
  chatList: {
    paddingBottom: 60,
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '100%',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
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
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
  },
  userMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
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
});