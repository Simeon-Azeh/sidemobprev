import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text, Modal, FlatList, Dimensions, StyleSheet, ActivityIndicator, Alert, useColorScheme } from 'react-native';
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

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeInputStyle = colorScheme === 'light' ? styles.lightInput : styles.darkInput;
  const themeButtonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
  const themeButtonBorderStyle = colorScheme === 'dark' ? styles.darkButtonBorder : {};
  const themeModalContainerStyle = colorScheme === 'light' ? styles.lightModalContainer : styles.darkModalContainer;
  const themeIconColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeProfileBorderColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_TEXT;
  const themeCameraIconColor = colorScheme === 'light' ? Colors.PRIMARY : '#000';
  const themePlaceholderTextColor = colorScheme === 'light' ? Colors.GRAY_LIGHT : Colors.DARK_TEXT_MUTED;

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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const { uri } = result.assets[0];
        const response = await fetch(uri);
        const blob = await response.blob();
        const user = auth.currentUser;
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setSelectedAvatar(downloadURL);
        Alert.alert('Success', 'Profile picture uploaded successfully!');
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert('Error', `Failed to upload profile picture: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCameraPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={selectedAvatar ? { uri: selectedAvatar } : DefaultAvatar} style={[styles.profileImage, { borderColor: themeProfileBorderColor }]} />
        <TouchableOpacity onPress={handleCameraPress} style={[styles.cameraIconContainer, { borderColor: themeProfileBorderColor }]}>
          <MaterialCommunityIcons name="camera-plus-outline" size={26} color={themeCameraIconColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileForm}>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="account-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="First Name"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            value={userData.firstName || ''}
            onChangeText={(text) => setUserData({ ...userData, firstName: text })}
          />
        </View>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="account-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            value={userData.lastName || ''}
            onChangeText={(text) => setUserData({ ...userData, lastName: text })}
          />
        </View>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="account-circle-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="Username"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            value={userData.username || ''}
            onChangeText={(text) => setUserData({ ...userData, username: text })}
          />
        </View>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="email-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            keyboardType="email-address"
            value={userData.email || ''}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
          />
        </View>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="phone-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            keyboardType="phone-pad"
            value={userData.phoneNumber || ''}
            onChangeText={(text) => setUserData({ ...userData, phoneNumber: text })}
          />
        </View>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="home-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="Address"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            value={userData.address || ''}
            onChangeText={(text) => setUserData({ ...userData, address: text })}
          />
        </View>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="City"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            value={userData.city || ''}
            onChangeText={(text) => setUserData({ ...userData, city: text })}
          />
        </View>
        <View style={[styles.inputContainer, themeInputStyle]}>
          <MaterialCommunityIcons name="map-outline" size={20} color={themeIconColor} />
          <TextInput
            placeholder="State"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, themeTextStyle]}
            value={userData.state || ''}
            onChangeText={(text) => setUserData({ ...userData, state: text })}
          />
        </View>
        <View style={[styles.inputContainer, { alignItems: 'flex-start' }, themeInputStyle]}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color={themeIconColor} style={{ marginTop: 10 }} />
          <TextInput
            placeholder="Bio"
            placeholderTextColor={themePlaceholderTextColor}
            style={[styles.inputField, { height: screenHeight * 0.1, textAlignVertical: 'top' }, themeTextStyle]}
            multiline
            value={userData.bio || ''}
            onChangeText={(text) => setUserData({ ...userData, bio: text })}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.button, themeButtonStyle, themeButtonBorderStyle]} onPress={handleUpdateProfile} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Profile</Text>}
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modalContainer, themeModalContainerStyle]}>
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
  container: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  lightContainer: {
    backgroundColor: Colors.WHITE,
  },
  darkContainer: {
    backgroundColor: Colors.DARK_BACKGROUND,
  },
  lightThemeText: {
    color: Colors.SECONDARY,
  },
  darkThemeText: {
    color: Colors.DARK_TEXT,
  },
  lightInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderColor: Colors.PRIMARY,
  },
  darkInput: {
    backgroundColor: Colors.DARK_SECONDARY,
    borderColor: Colors.DARK_BORDER,
  },
  lightButton: {
    backgroundColor: Colors.PRIMARY,
  },
  darkButton: {
    backgroundColor: Colors.DARK_BUTTON,
    borderColor: Colors.DARK_BORDER,
    borderWidth: 1,
  },
  lightModalContainer: {
    backgroundColor: Colors.WHITE,
  },
  darkModalContainer: {
    backgroundColor: Colors.DARK_BACKGROUND,
  },
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
    paddingHorizontal: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: screenHeight * 0.02,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  avatarOption: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: 10,
    margin: 10,
  },
  uploadButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  profileForm: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Medium',
  },
  inputFieldFocused: {
    borderColor: Colors.PRIMARY,
  },
  profileImage: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    borderRadius: 50,
    borderWidth: 2,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: screenWidth * 0.34,
    backgroundColor: 'white',
    borderRadius: 100,
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});