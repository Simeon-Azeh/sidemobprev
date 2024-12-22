import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function ChatHeader({ chat, realTimestamp, setActive }) {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeStatus, setActiveStatus] = useState(chat.active ? 'Active now' : `Last seen ${realTimestamp}`);

  // Update the active state when the user views the chat page
  useEffect(() => {
    if (setActive) setActive(true); // Inform parent or context that user is online
    setActiveStatus('Active now');
    return () => {
      if (setActive) setActive(false); // Reset to inactive when leaving
    };
  }, [setActive]);

  const handleProfilePageNavigation = () => {
    navigation.navigate('ProfilePage', { user: chat });
  };

  const handleAction = (action) => {
    setModalVisible(false);
    switch (action) {
      case 'View Profile':
        handleProfilePageNavigation();
        break;
      case 'Block User':
        Alert.alert('Block User', 'Are you sure you want to block this user?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Block', onPress: () => console.log('User blocked') },
        ]);
        break;
      case 'Report User':
        Alert.alert('Report User', 'Are you sure you want to report this user?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Report', onPress: () => console.log('User reported') },
        ]);
        break;
      case 'Mute Notifications':
        console.log('Notifications muted');
        break;
      case 'Delete Chat':
        Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => console.log('Chat deleted') },
        ]);
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="chevron-left" size={30} color={Colors.SECONDARY} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfilePageNavigation} style={styles.profileContainer}>
        <Image source={{ uri: chat.profileImage }} style={styles.profileImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.chatName}>{chat.name.split(' ')[0]}</Text>
          <Text style={styles.activeStatus}>{activeStatus}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.ellipsisButton}>
        <Icon name="more-vertical" size={25} color={Colors.SECONDARY} />
      </TouchableOpacity>

      {/* Actions Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Actions</Text>
            {['View Profile', 'Block User', 'Report User', 'Mute Notifications', 'Delete Chat'].map((action) => (
              <TouchableOpacity
                key={action}
                style={styles.modalOption}
                onPress={() => handleAction(action)}
              >
                <Text style={styles.modalOptionText}>{action}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: 50,
    marginRight: 10,
  },
  headerTextContainer: {
    flexDirection: 'column',
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
  ellipsisButton: {
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
  modalCancel: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#FF0000',
    fontFamily: 'Poppins-Medium',
  },
});
