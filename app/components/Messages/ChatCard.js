import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/Utils/Colors';
import { getAuth } from 'firebase/auth';

export default function ChatCard({ chat }) {
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const chatId = [currentUser.uid, chat.id].sort().join('_'); // Unique chat ID for the pair of users

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('ChatPage', {
          chat: { ...chat, id: chatId },
          realTimestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        })
      }
    >
      <Image source={{ uri: chat.profileImage }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{chat.name}</Text>
          <Text style={styles.time}>{chat.time || ''}</Text>
        </View>
        <Text style={styles.messagePreview}>{chat.message || 'Select chat to start messaging'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins',
  },
  time: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins',
  },
  messagePreview: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    fontFamily: 'Poppins',
  },
});