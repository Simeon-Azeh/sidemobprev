import React from 'react';
import { View, Text, Image, StyleSheet, SectionList, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width: screenWidth } = Dimensions.get('window');

export default function ProfilePage({ route }) {
  const { user } = route.params;

  const sections = [
    {
      data: [
        { type: 'userInfo', profileImage: user.profileImage, name: user.name, bio: user.bio },
      ],
    },
    {
      title: 'Bio',
      data: [
        { type: 'bio', fullBio: user.fullBio },
      ],
    },
    {
    
      data: [
        { type: 'contact', phone: user.phone, email: user.email, address: user.address },
      ],
    },
    {
      title: 'Actions',
      data: [
        { type: 'action', icon: 'lock', actionText: 'Lock Chat', description: 'Keep this chat secure.', onPress: () => console.log('Lock Chat Pressed') },
        { type: 'action', icon: 'bell', actionText: 'Customize Notifications', description: 'Manage notification settings.', onPress: () => console.log('Customize Notifications Pressed') },
        { type: 'action', icon: 'users', actionText: 'Create Group', description: 'Start a group chat with this user.', onPress: () => console.log('Create Group Pressed') },
        { type: 'action', icon: 'star', actionText: 'Add to Favorites', onPress: () => console.log('Add to Favorites Pressed') },
        { type: 'action', icon: 'slash', actionText: 'Block', onPress: () => console.log('Block Pressed') },
        { type: 'action', icon: 'volume-x', actionText: 'Mute', onPress: () => console.log('Mute Pressed') },
      ],
    },
    {
      title: 'Shared Files',
      data: [
        { type: 'file', name: 'Document1.pdf' },
        { type: 'file', name: 'Photo.png' },
        { type: 'file', name: 'Presentation.pptx' },
      ],
    },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'userInfo':
        return (
          <View style={styles.userInfoContainer}>
            <Image source={item.profileImage} style={styles.profileImage} />
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userBio}>{item.bio}</Text>
            </View>
          </View>
        );
      case 'bio':
        return (
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{item.fullBio}</Text>
          </View>
        );
      case 'contact':
        return (
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Contact Info</Text>
            <Text style={styles.contactText}><FontAwesome6 name="square-phone" size={24} color={Colors.SECONDARY} style={{ marginRight: 10 }} /> {item.phone}</Text>
            <Text style={styles.contactText}><MaterialCommunityIcons name="email-multiple" size={24} color={Colors.SECONDARY} style={{ marginRight: 10 }} /> {item.email}</Text>
            <Text style={styles.contactText}><FontAwesome5 name="map-marked" size={24} color={Colors.SECONDARY} style={{ marginRight: 10 }} /> {item.address}</Text>
          </View>
        );
      case 'action':
        return (
          <TouchableOpacity style={styles.actionItem} onPress={item.onPress}>
            <Icon name={item.icon} size={24} color={Colors.SECONDARY} />
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionText}>{item.actionText}</Text>
              {item.description && <Text style={styles.actionDescription}>{item.description}</Text>}
            </View>
          </TouchableOpacity>
        );
      case 'file':
        return (
          <View style={styles.fileItem}>
            <Text style={styles.fileName}>{item.name}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      keyExtractor={(item, index) => item + index}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.15,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  userInfoText: {
    alignItems: 'center',
  },
  userName: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 5,
  },
  userBio: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: '#888',
  },
  bioContainer: {
    marginBottom: 20,
  },
  bioText: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
    color: '#333',
    lineHeight: 22,
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  contactText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: '#333',
    marginBottom: 5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionTextContainer: {
    marginLeft: 10,
  },
  actionText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  actionDescription: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
    color: '#555',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  fileItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  fileName: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: '#333',
  },
});
