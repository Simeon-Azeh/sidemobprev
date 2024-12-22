import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';

export default function InputSection({ message, setMessage, handleSend, handleFileAttachment, setShowEmojiPicker }) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});