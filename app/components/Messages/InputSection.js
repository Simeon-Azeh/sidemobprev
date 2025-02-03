import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Alticon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../assets/Utils/Colors';
import * as DocumentPicker from 'expo-document-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, storage, firestore } from '../../../firebaseConfig';
import { useColorScheme } from 'react-native';
import { Audio } from 'expo-av';

export default function InputSection({ message, setMessage, handleSend, handleFileAttachment, setShowEmojiPicker, chatType, replyingTo }) {
  const [attachedFile, setAttachedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const colorScheme = useColorScheme();

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      // Handle the recorded audio file (e.g., upload it to Firebase)
    } else {
      // Start recording
      setIsRecording(true);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access microphone is required!');
        return;
      }
      const recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
        console.log('Recording started');
      } catch (error) {
        console.error('Failed to start recording', error);
      }
    }
  }, [isRecording, recording]);

  const handleSendMessage = async () => {
    const currentMessage = message;
    setMessage(''); // Clear the message input field immediately

    if (attachedFile) {
      const user = auth.currentUser;
      const chatId = chatType === 'group' ? 'groupChatId' : 'individualChatId'; // Replace with actual chat ID logic
      const messagesRef = collection(firestore, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: '',
        fileUrl: attachedFile.downloadURL,
        fileName: attachedFile.name,
        sentByUser: user.email,
        timestamp: Timestamp.now(),
        unread: true,
      });
      setAttachedFile(null); // Clear the attached file after sending the message
    } else {
      handleSend(currentMessage, chatType === 'group' ? 'group' : 'individual', replyingTo);
    }
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

        setAttachedFile({ name, downloadURL });

        // Add file reference to Firestore immediately
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

        Alert.alert('Success', 'File uploaded successfully!');
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert('Error', `Failed to upload file: ${error.message}`);
    }
  };

  return (
    <View style={[styles.inputContainer, { 
      backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND, 
      borderTopColor: colorScheme === 'light' ? '#eee' : Colors.DARK_BORDER 
    }]}>
      {replyingTo && (
        <View style={[styles.replyPreview, {
          backgroundColor: colorScheme === 'light' ? '#f5f5f5' : Colors.DARK_SECONDARY
        }]}>
          <View style={styles.replyContent}>
            <Text style={[styles.replyLabel, {
              color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE
            }]}>Replying to:</Text>
            <Text style={styles.replyPreviewText} numberOfLines={1}>
              {replyingTo.text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyingTo(null)}>
            <Icon name="close-circle" size={20} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      )}
      {attachedFile && (
        <View style={styles.attachmentContainer}>
          <MaterialIcons name="attachment" size={25} color={Colors.SECONDARY} />
          <Text style={styles.attachmentText}>{attachedFile.name}</Text>
        </View>
      )}
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowEmojiPicker(prev => !prev)}
        >
          <Alticon name="emoji-happy" size={25} color={Colors.SECONDARY} />
        </TouchableOpacity>
        <ScrollView style={styles.textInputContainer} contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor={colorScheme === 'light' ? '#888' : '#ccc'}
            value={message}
            onChangeText={setMessage}
            style={[styles.textInput, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY, color: colorScheme === 'light' ? '#000' : '#fff' }]}
            multiline
            blurOnSubmit={false}
          />
        </ScrollView>
        <TouchableOpacity style={styles.iconButton} onPress={handleFilePicker}>
          <MaterialIcons name="attach-file" size={25} color={Colors.SECONDARY} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]} 
          onPress={message.trim().length > 0 ? handleSendMessage : toggleRecording}
        >
          <Icon 
            name={message.trim().length > 0 ? "send" : "mic"} 
            size={25} 
            color={colorScheme === 'light' ? '#fff' : '#000'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  textInputContainer: {
    flex: 1,
    maxHeight: 100, // Limit the height of the input field
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
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  attachmentText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins',
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  replyPreviewText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins-Medium',
  },
});