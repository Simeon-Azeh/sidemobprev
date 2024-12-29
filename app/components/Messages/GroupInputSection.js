import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Alticon from 'react-native-vector-icons/Entypo';
import Colors from '../../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';

export default function GroupInputSection({ message, setMessage, handleSend, setShowEmojiPicker }) {
  const colorScheme = useColorScheme();

  const handleSendMessage = () => {
    handleSend('group');
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND, borderTopColor: colorScheme === 'light' ? '#eee' : Colors.DARK_BORDER }]}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setShowEmojiPicker(prev => !prev)}
      >
        <Alticon name="emoji-happy" size={25} color={Colors.SECONDARY} />
      </TouchableOpacity>
      <TextInput
        placeholder="Type a message..."
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#ccc'}
        value={message}
        onChangeText={setMessage}
        style={[styles.textInput, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY, color: colorScheme === 'light' ? '#000' : '#fff' }]}
        multiline
        blurOnSubmit={false}
      />
      <TouchableOpacity style={[styles.sendButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]} onPress={handleSendMessage}>
        <Icon name="send" size={25} color={colorScheme === 'light' ? '#fff' : '#000'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 1,
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
    borderRadius: 25,
    fontSize: 16,
    marginHorizontal: 5,
    fontFamily: 'Poppins',
  },
  sendButton: {
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});