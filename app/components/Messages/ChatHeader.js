import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function ChatHeader({ chat, realTimestamp }) {
  const navigation = useNavigation();

  const handleProfilePageNavigation = () => {
    navigation.navigate('ProfilePage', { user: chat });
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    width: '100%',
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
    marginRight: 20,
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
});