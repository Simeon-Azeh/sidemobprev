import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Alticon from 'react-native-vector-icons/Entypo';
import Colors from '../../../assets/Utils/Colors';

export default function GroupInputSection({ message, setMessage, handleSend, setShowEmojiPicker }) {
  const handleSendMessage = () => {
    handleSend('group');
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setShowEmojiPicker(prev => !prev)}
      >
        <Alticon name="emoji-happy" size={25} color={Colors.SECONDARY} />
      </TouchableOpacity>
      <TextInput
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
        style={styles.textInput}
        multiline
        blurOnSubmit={false}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        <Icon name="send" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    fontSize: 16,
    marginHorizontal: 5,
    fontFamily: 'Poppins',
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});