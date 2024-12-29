import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, StyleSheet, ActivityIndicator, Dimensions, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DefaultAvatar from '../../../assets/Images/defaultAvatar.jpg';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const avatars = [
  'https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4395.jpg',
  'https://img.freepik.com/premium-vector/logo-kid-gamer_573604-742.jpg',
  'https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4432.jpg',
  'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png',
  'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Penguin-512.png',
  'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Panda-512.png',
  'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png',
  'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Pig-512.png',
  // Add more avatar links here
];

export default function GroupCreationModal({ visible, onClose }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupProfilePictureUri, setGroupProfilePictureUri] = useState('');
  const [groupProfilePictureUrl, setGroupProfilePictureUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const toggleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user)
        ? prevSelectedUsers.filter((u) => u !== user)
        : [...prevSelectedUsers, user]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }

    if (!groupProfilePictureUrl) {
      alert('Please upload a group image.');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore();
      const groupData = {
        name: groupName,
        description: groupDescription,
        profilePicture: groupProfilePictureUrl,
        members: selectedUsers.map((user) => user.email),
        createdBy: currentUser.email,
        visibility: isPublic ? 'public' : 'private',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'groups'), groupData);
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'There was an error creating the group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setGroupProfilePictureUri(avatar);
    setGroupProfilePictureUrl(avatar);
    setModalVisible(false);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const { uri } = result.assets[0];
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `groupAvatars/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setGroupProfilePictureUri(uri);
        setGroupProfilePictureUrl(downloadURL);
        Alert.alert('Success', 'Group picture uploaded successfully!');
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert('Error', `Failed to upload group picture: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCameraPress = () => {
    setModalVisible(true);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
        <Text style={[styles.modalTitle, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>Create New Group</Text>
        
        <TextInput
          style={[styles.input, styles.semiBoldFont, { backgroundColor: colorScheme === 'light' ? '#f9f9f9' : Colors.DARK_SECONDARY, color: colorScheme === 'light' ? '#000' : '#fff' }]}
          placeholder="Group Name"
          placeholderTextColor={colorScheme === 'light' ? '#888' : '#ccc'}
          value={groupName}
          onChangeText={setGroupName}
        />
        
        <TextInput
          style={[styles.input, styles.semiBoldFont, { backgroundColor: colorScheme === 'light' ? '#f9f9f9' : Colors.DARK_SECONDARY, color: colorScheme === 'light' ? '#000' : '#fff' }]}
          placeholder="Group Description"
          placeholderTextColor={colorScheme === 'light' ? '#888' : '#ccc'}
          value={groupDescription}
          onChangeText={setGroupDescription}
        />
        
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image source={groupProfilePictureUri ? { uri: groupProfilePictureUri } : DefaultAvatar} style={{ width: screenWidth * 0.2, height: screenWidth * 0.2, borderRadius: 50 }} />
          <TouchableOpacity onPress={handleCameraPress} style={{ position: 'absolute', bottom: 0, right: screenWidth * 0.36, backgroundColor: 'white', borderRadius: 50, width: screenWidth * 0.08, height: screenWidth * 0.08, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="camera" size={26} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.visibilityContainer}>
          <TouchableOpacity
            style={[styles.visibilityButton, isPublic && styles.selectedVisibilityButton, { backgroundColor: isPublic ? Colors.PRIMARY : (colorScheme === 'light' ? '#f7f7f7' : Colors.DARK_SECONDARY) }]}
            onPress={() => setIsPublic(true)}
          >
            <Text style={[styles.visibilityButtonText, isPublic && styles.selectedVisibilityButtonText, { color: isPublic ? '#fff' : Colors.PRIMARY }]}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.visibilityButton, !isPublic && styles.selectedVisibilityButton, { backgroundColor: !isPublic ? Colors.PRIMARY : (colorScheme === 'light' ? '#f7f7f7' : Colors.DARK_SECONDARY) }]}
            onPress={() => setIsPublic(false)}
          >
            <Text style={[styles.visibilityButtonText, !isPublic && styles.selectedVisibilityButtonText, { color: !isPublic ? '#fff' : Colors.PRIMARY }]}>Private</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={users}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.userItem, selectedUsers.includes(item) && styles.selectedUserItem, { backgroundColor: selectedUsers.includes(item) ? Colors.PRIMARY_LIGHT : (colorScheme === 'light' ? '#f9f9f9' : Colors.DARK_SECONDARY) }]}
              onPress={() => toggleUserSelection(item)}
            >
              <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>{item.firstName} {item.lastName}</Text>
                <Text style={[styles.userEmail, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {loading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.createButton, { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY }]} onPress={handleCreateGroup}>
              <Text style={styles.buttonText}>Create Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_SECONDARY, borderColor: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_SECONDARY }]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
          <Text style={[styles.modalTitle, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>Select Group Icon</Text>
          <FlatList
            data={avatars}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAvatarSelect(item)}>
                <Image source={{ uri: item }} style={styles.avatarOption} />
              </TouchableOpacity>
            )}
            numColumns={3}
          />
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_PRIMARY, borderColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_PRIMARY, borderWidth: 1 }]} onPress={handlePickImage}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={20} color="white" />
                <Text style={styles.uploadButtonText}>Upload Custom Icon</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_PRIMARY, borderColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_PRIMARY, borderWidth: 1 }]} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  semiBoldFont: {
    fontFamily: 'Poppins-SemiBold',
  },
  uploadButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 15,
  },
  visibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  visibilityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedVisibilityButton: {
    backgroundColor: Colors.PRIMARY,
  },
  visibilityButtonText: {
    fontFamily: 'Poppins-Medium',
  },
  selectedVisibilityButtonText: {
    color: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 5,
    borderRadius: 8,
  },
  selectedUserItem: {
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontFamily: 'Poppins',
    fontSize: 16,
  },
  userEmail: {
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  createButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  loader: {
    marginTop: 30,
  },
  avatarOption: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: 10,
    margin: 10,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
});