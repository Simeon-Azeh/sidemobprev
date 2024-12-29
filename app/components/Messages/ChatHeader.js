import React, { useState } from 'react';
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
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth } = Dimensions.get('window');

export default function ChatHeader({ chat }) {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

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
    <View style={[styles.headerContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND, borderBottomColor: colorScheme === 'light' ? '#ddd' : Colors.DARK_BORDER }]}>
      <StatusBar
        style={colorScheme === 'light' ? 'dark' : 'light'}
        backgroundColor={colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="chevron-left" size={30} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfilePageNavigation} style={styles.profileContainer}>
        <Image source={{ uri: chat.profileImage }} style={styles.profileImage} />
        <View style={styles.headerTextContainer}>
          <Text style={[styles.chatName, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{chat.name.split(' ')[0]}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.ellipsisButton}>
        <Icon name="more-vertical" size={25} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
      </TouchableOpacity>

      {/* Actions Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
            <Text style={[styles.modalTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Actions</Text>
            {['View Profile', 'Block User', 'Report User', 'Mute Notifications', 'Delete Chat'].map((action) => (
              <TouchableOpacity
                key={action}
                style={styles.modalOption}
                onPress={() => handleAction(action)}
              >
                <Text style={[styles.modalOptionText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{action}</Text>
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
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    
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
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
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