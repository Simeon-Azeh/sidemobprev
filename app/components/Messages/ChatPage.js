import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, FlatList, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

const { width: screenWidth } = Dimensions.get('window');
const educationEmojis = [
    '😀', '😁', '😂', '🤣', '😃',
    '📝', '✏️', '🖊️', '🖋️', '✒️', '📒', '📔', '📕',
    '📚', '📙', '📘', '📗', '📓', '📖', '📜', '📃',
    '📑', '🔖', '🗂️', '🗃️', '🗄️', '🔍', '🔎', '🔬',
    '🔭', '🧬', '🧫', '🧪', '👩‍🏫', '👩‍🎓', '👩‍🔬',
    '👨‍💻', '👨‍🏫', '🎓', '🏆', '🥇', '🥈', '🥉',
];

export default function ChatPage({ route }) {
  const navigation = useNavigation();
  const { chat, realTimestamp } = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: chat.message, sentByUser: false, timestamp: realTimestamp }, // Initialize with default chat message and timestamp
  ]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: message,
        sentByUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format as needed
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleDeleteMessage = (messageId) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => setMessages(messages.filter(message => message.id !== messageId)),
        },
      ],
      { cancelable: true }
    );
  };

  const handleFileAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'], // You can specify types if needed
        copyToCacheDirectory: true, // Ensure the file is copied to cache
      });
      if (result.type === 'success') {
        console.log('File picked:', result);
        // Handle the file upload or attachment logic here
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

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sentByUser ? styles.userMessageContainer : styles.receivedMessageContainer]}>
      <TouchableOpacity
        onLongPress={() => handleDeleteMessage(item.id)} // Handle long press for deletion
        style={[styles.messageBubble, item.sentByUser ? styles.userMessage : styles.receivedMessage]}
      >
        <Text style={[styles.messageText, item.sentByUser ? styles.userMessageText : styles.receivedMessageText]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.messageTime, item.sentByUser ? styles.userMessageTime : styles.receivedMessageTime]}>
        {item.timestamp}
      </Text>
    </View>
  );

  const handleProfilePageNavigation = () => {
    navigation.navigate('ProfilePage', { user: chat });
  };

  return (
    <View style={styles.container}>
      {/* Header with Chevron, Profile Picture, Call Icon, and Ellipsis Icon */}
      <TouchableOpacity onPress={handleProfilePageNavigation} style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={30} color={Colors.SECONDARY} />
        </TouchableOpacity>
        <Image source={chat.profileImage} style={styles.profileImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.activeStatus}>{chat.active ? 'Active now' : `Last seen ${realTimestamp}`}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => console.log('Call initiated')} style={styles.callButton}>
            <Icon name="phone" size={25} color={Colors.SECONDARY} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('More actions')} style={styles.ellipsisButton}>
            <Icon name="more-vertical" size={25} color={Colors.SECONDARY} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Chatting Container */}
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
        />
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleFileAttachment}>
          <Icon name="paperclip" size={25} color={Colors.SECONDARY} />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowEmojiPicker(prev => !prev)}
        >
          <Icon name="smile" size={25} color={Colors.SECONDARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="send" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <View style={styles.emojiPickerContainer}>
          <FlatList
            data={educationEmojis}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEmojiSelect(item)} style={styles.emojiButton}>
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emojiScrollView}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
      marginTop: 40, // Increased top margin
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff',
      marginBottom: 10,
      width: '100%', // Ensure full width
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    backButton: {
      paddingRight: 10,
    },
    profileImage: {
      width: screenWidth * 0.1,
      height: screenWidth * 0.1,
      borderRadius: 50,
      marginRight: 10,
    },
    headerTextContainer: {
      flex: 1,
      flexDirection: 'column',
      marginRight: 20, // Add margin to push icons away from the name
    },
    chatName: {
      fontSize: 18,
      fontFamily: 'Poppins-Medium',
      color: Colors.SECONDARY,
    },
    activeStatus: {
      fontSize: screenWidth * 0.03,
      color: '#888',
      fontFamily: 'Poppins',
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    callButton: {
      marginRight: 10,
    },
    ellipsisButton: {
      paddingHorizontal: 10,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: 15,
    },
    chatList: {
      paddingBottom: 60,
    },
    messageContainer: {
      marginVertical: 5,
      flexDirection: 'column', // Changed to column layout
      alignItems: 'flex-start', // Align all items to the start
      maxWidth: '100%',
    },
    messageBubble: {
      padding: 10,
      borderRadius: 10,
      maxWidth: '75%', // Adjust width as needed
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
      color: '#000', // Set received message text color to black
    },
    messageTime: {
      fontSize: 12,
      color: '#888',
      marginTop: 5,
      marginHorizontal: 5,
    },
    userMessageTime: {
      alignSelf: 'flex-end', // Align timestamp to the end for sent messages
    },
    receivedMessageTime: {
      alignSelf: 'flex-start', // Align timestamp to the start for received messages
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    iconButton: {
      padding: 10,
    },
    textInput: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
      fontSize: 16,
      marginHorizontal: 5,
      fontFamily: 'Poppins',
    },
    sendButton: {
      backgroundColor: Colors.PRIMARY,
      padding: 10,
      borderRadius: 20,
    },
    emojiPickerContainer: {
      position: 'absolute',
      bottom: 60, // Adjust to fit above the input bar
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    emojiScrollView: {
      padding: 10,
    },
    emojiButton: {
      padding: 5,
    },
    emoji: {
      fontSize: 24, // Adjust size as needed
    },
  });
  