// ChatCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import ProfileAvatar from '../../../assets/Images/avatar4.jpg'; // Replace with actual image path

export default function ChatCard() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('Chat')}>
      <Image source={ProfileAvatar} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>Sidec Support</Text>
        <Text style={styles.messagePreview}>Welcome to Sidec! How can we assist you today?</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#888" />
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  messagePreview: {
    fontSize: 14,
    color: '#888',
  },
});
