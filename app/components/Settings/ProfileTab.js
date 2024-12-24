import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text, Modal, FlatList, Dimensions, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, storage } from '../../../firebaseConfig';
import DefaultAvatar from '../../../assets/Images/defaultAvatar.jpg';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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

export default function ProfileTab() {
  const [userData, setUserData] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            setSelectedAvatar(userDoc.data().avatar);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(getFirestore(), 'users', user.uid);
        await updateDoc(userRef, {
          ...userData,
          avatar: selectedAvatar,
        });
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setModalVisible(false);
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      const { uri } = result.assets[0];
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setSelectedAvatar(downloadURL);
      setUploading(false);
      Alert.alert('Success', 'Profile picture uploaded successfully!');
    }
  };

  const handleCameraPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={selectedAvatar ? { uri: selectedAvatar } : DefaultAvatar} style={{ width: screenWidth * 0.2, height: screenWidth * 0.2, borderRadius: 50 }} />
        <TouchableOpacity onPress={handleCameraPress} style={{ position: 'absolute', bottom: 0, right: screenWidth * 0.36, backgroundColor: 'white', borderRadius: 50, width: screenWidth * 0.08, height: screenWidth * 0.08, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="camera-plus-outline" size={26} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>First Name</Text>
      <TextInput placeholder="First Name" style={styles.input} value={userData.firstName || ''} onChangeText={(text) => setUserData({ ...userData, firstName: text })} />
      <Text style={styles.label}>Last Name</Text>
      <TextInput placeholder="Last Name" style={styles.input} value={userData.lastName || ''} onChangeText={(text) => setUserData({ ...userData, lastName: text })} />
      <Text style={styles.label}>Username</Text>
      <TextInput placeholder="Username" style={styles.input} value={userData.username || ''} onChangeText={(text) => setUserData({ ...userData, username: text })} />
      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="Email" style={styles.input} value={userData.email || ''} onChangeText={(text) => setUserData({ ...userData, email: text })} />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput placeholder="Phone Number" style={styles.input} value={userData.phoneNumber || ''} onChangeText={(text) => setUserData({ ...userData, phoneNumber: text })} />
      <Text style={styles.label}>Address</Text>
      <TextInput placeholder="Address" style={styles.input} value={userData.address || ''} onChangeText={(text) => setUserData({ ...userData, address: text })} />
      <Text style={styles.label}>State</Text>
      <TextInput placeholder="State" style={styles.input} value={userData.state || ''} onChangeText={(text) => setUserData({ ...userData, state: text })} />
      <Text style={styles.label}>City</Text>
      <TextInput placeholder="City" style={styles.input} value={userData.city || ''} onChangeText={(text) => setUserData({ ...userData, city: text })} />
      <Text style={styles.label}>Bio</Text>
      <TextInput placeholder="Bio" style={[styles.input, { height: screenHeight * 0.08 }]} multiline value={userData.bio || ''} onChangeText={(text) => setUserData({ ...userData, bio: text })} />
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Profile</Text>}
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Avatar</Text>
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
          <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="upload" size={20} color="white" />
                <Text style={styles.uploadButtonText}>Upload Custom Avatar</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    width: '100%',
    fontSize: screenWidth * 0.035,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    marginTop: screenHeight * 0.02, 
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium'
  },
  label: {
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20
  },
  avatarOption: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: 10,
    margin: 10
  },
  uploadButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    marginLeft: 10
  },
  closeButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 20
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium'
  }
});