import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Alticon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../assets/Utils/Colors';
import * as DocumentPicker from 'expo-document-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, storage, firestore } from '../../../firebaseConfig';

export default function InputSection({ message, setMessage, handleSend, handleFileAttachment, setShowEmojiPicker, chatType }) {
  const [attachedFile, setAttachedFile] = useState(null);

  const handleSendMessage = () => {
    if (chatType === 'group') {
      handleSend('group');
    } else {
      handleSend('individual');
    }
    setAttachedFile(null); // Clear the attached file after sending the message
  };

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const { uri, name } = result;
        const response = await fetch(uri);
        const blob = await response.blob();
        const user = auth.currentUser;
        const storageRef = ref(storage, `files/${user.uid}/${name}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        // Add file reference to Firestore messages
        const chatId = chatType === 'group' ? 'groupChatId' : 'individualChatId'; // Replace with actual chat ID logic
        const messagesRef = collection(firestore, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
          text: '',
          fileUrl: downloadURL,
          fileName: name,
          sentByUser: user.email,
          timestamp: Timestamp.now(),
          unread: true,
        });

        setAttachedFile({ name, downloadURL });
        Alert.alert('Success', 'File uploaded successfully!');
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert('Error', `Failed to upload file: ${error.message}`);
    }
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
      {attachedFile && (
        <View style={styles.attachmentContainer}>
          <MaterialIcons name="attachment" size={25} color={Colors.SECONDARY} />
          <Text style={styles.attachmentText}>{attachedFile.name}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.iconButton} onPress={handleFilePicker}>
        <MaterialIcons name="attach-file" size={25} color={Colors.SECONDARY} />
      </TouchableOpacity>
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
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  attachmentText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins',
  },
});