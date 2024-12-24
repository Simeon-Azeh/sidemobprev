import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, FlatList, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import firebase from '../../../firebaseConfig';

import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import welcome1 from '../../../assets/Images/OnboardingImg.png';
import welcome2 from '../../../assets/Images/Onboarding2.png';
import welcome3 from '../../../assets/Images/Onboarding3.png';
import welcome4 from '../../../assets/Images/Onboarding4.png';


const avatars = [
  { id: '1', source: 'https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4395.jpg', label: 'Avatar 1' },
  { id: '2', source: 'https://img.freepik.com/premium-vector/logo-kid-gamer_573604-742.jpg', label: 'Avatar 2' },
  { id: '3', source: 'https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4432.jpg', label: 'Avatar 3' },
  { id: '4', source: 'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png', label: 'Avatar 4' },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const db = getFirestore();
const storage = getStorage(); 

const Onboarding = () => {
  const swiperRef = useRef(null);
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [city, setCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploading, setUploading] = useState(false); 

  const handleGetStarted = async () => {
    try {
      const user = auth.currentUser;
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        gender: selectedGender,
        city,
        country: selectedCountry,
        avatar: selectedAvatar,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      navigation.navigate('Drawer');
    } catch (error) {
      console.error("Error updating user document:", error);
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
  };

  const handleSendVerificationLink = async () => {
    try {
      const user = auth.currentUser;
      await sendEmailVerification(user);
      Alert.alert('Verification Email Sent', `A verification email will be sent to ${user.email}. Please verify before you continue.`);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  const handleCheckVerificationStatus = async () => {
    try {
      const user = auth.currentUser;
      await user.reload();
      if (user.emailVerified) {
        await updateDoc(doc(db, 'users', user.uid), {
          emailVerified: true,
          updatedAt: new Date().toISOString()
        });
        handleNext();
      } else {
        Alert.alert('Email not verified', 'Please verify your email before proceeding.');
      }
    } catch (error) {
      console.error("Error checking email verification status:", error);
    }
  };

  const renderAvatar = ({ item }) => (
    <TouchableOpacity
      style={[styles.avatarContainer, selectedAvatar === item.source && styles.selectedAvatar]}
      onPress={() => setSelectedAvatar(item.source)}
    >
      <Image source={{ uri: item.source }} style={styles.avatarImage} />
      <Text style={styles.avatarLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Swiper 
          ref={swiperRef} 
          style={styles.wrapper} 
          showsButtons={false} 
          loop={false} 
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
        >
          <View style={styles.slideContainer}>
            <Image source={welcome1} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Welcome to the Learning Journey! 🎉</Text>
              <Text style={styles.subtitle}>
                We're excited to have you with us! 😊 To get started, we just need a little bit of information to personalize your learning experience and make it even more amazing. 📚✨
              </Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}> Let's Begin 🚀 </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.slideContainer}>
            <Image source={welcome2} style={styles.image} />
            <View style={[styles.textContainer, styles.secondaryContainer]}>
              <Text style={[styles.title, { color: Colors.SECONDARY }]}>More About You</Text>
              <TextInput
                autoCompleteType="text"
                keyboardType="default"
                textContentType="givenName"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.textInput}
              />
              <TextInput
                autoCompleteType="text"
                keyboardType="default"
                textContentType="familyName"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.textInput}
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedGender}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedGender(itemValue)}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
              <TextInput
                autoCompleteType="text"
                keyboardType="default"
                textContentType="addressCity"
                placeholder="City"
                value={city}
                onChangeText={setCity}
                style={styles.textInput}
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCountry}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedCountry(itemValue)}
                >
                  <Picker.Item label="Select Country" value="" />
                  <Picker.Item label="Cameroon" value="cmr" />
                  <Picker.Item label="Nigeria" value="ng" />
                  <Picker.Item label="Ghana" value="gh" />
                  <Picker.Item label="Rwanda" value="rw" />
                  <Picker.Item label="Kenya" value="ke" />
                </Picker>
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                <Text style={styles.primaryButtonText}>Next</Text>
                <Icon name="arrow-forward" size={15} color={Colors.WHITE} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.slideContainer}>
            <Image source={welcome3} style={styles.image} />
            <View style={[styles.textContainer, styles.fullHeightContainer]}>
              <Text style={styles.title}>Verify Account</Text>
              <Text style={styles.subtitle}>
                A verification email will be sent to {auth.currentUser?.email}. Please verify before you continue.
              </Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleSendVerificationLink}>
                <Text style={styles.nextButtonText}>Send Link ➤ </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleCheckVerificationStatus}>
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="arrow-forward" size={15} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.slideContainer}>
            <Image source={welcome4} style={styles.image} />
            <View style={[styles.textContainer, styles.secondaryContainer, { padding: 20, paddingHorizontal: 40 }]}>
              <Text style={[styles.title, { color: Colors.SECONDARY }]}>Choose an Avatar</Text>
              <Text style={[styles.subtitle, { color: Colors.SECONDARY }]}>You can change it later on your profile.</Text>
              <FlatList
                data={avatars}
                renderItem={renderAvatar}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.avatarRow}
              />
              <TouchableOpacity style={styles.primaryButton} onPress={handlePickImage}>
                <Text style={styles.primaryButtonText}>Upload Your Own</Text>
                <Icon name="cloud-upload" size={15} color={Colors.WHITE} />
              </TouchableOpacity>
              {uploading && <ActivityIndicator size="large" color={Colors.PRIMARY} />} 
              <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
                <Text style={styles.primaryButtonText}>Finish</Text>
                <Icon name="arrow-forward" size={15} color={Colors.WHITE} />
              </TouchableOpacity>
            </View>
          </View>
        </Swiper>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};




const styles = StyleSheet.create({
  // Your existing styles...
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarLabel: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.SECONDARY,
  },
  avatarRow: {
    justifyContent: 'space-between',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  primaryButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    marginRight: 10,
  },
  // Add other styles as needed...
  wrapper: {},
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    resizeMode: 'contain',
    marginTop: 10,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: Colors.PRIMARY,
    flex: 1,
    justifyContent: 'center',
    marginTop: -screenHeight * 0.1,
  },
  secondaryContainer: {
    backgroundColor: Colors.WHITE,
  },
  fullHeightContainer: {
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
  },
  title: {
    fontSize: screenWidth * 0.06,
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: screenWidth * 0.035,
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
  },
  textInput: {
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.035,
  },
  pickerContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
    borderColor: Colors.PRIMARY,
    paddingHorizontal: 5,
    borderWidth: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.035,
  },
  picker: {
    height: 50,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
    color: Colors.WHITE,
  },
  codeInput: {
    borderColor: Colors.WHITE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: screenWidth * 0.1,
    textAlign: 'center',
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.WHITE,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
    width: '40%',
  },
  nextButtonText: {
    color: Colors.PRIMARY,
    fontSize: 15,
    marginRight: 5,
    fontFamily: 'Poppins-Medium',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  primaryButtonText: {
    color: Colors.WHITE,
    fontSize: 15,
    marginRight: 5,
    fontFamily: 'Poppins-Medium',
  },
  dot: {
    backgroundColor: '#D9D9D9',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: Colors.PRIMARY,
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    margin: 10,
    borderWidth: 2,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    padding: 10,
  },
  selectedAvatar: {
    borderColor: Colors.PRIMARY,
  },
  avatarImage: {
    width: screenWidth * 0.3, // 40% of the screen width
    height: screenWidth * 0.3, // Keep aspect ratio (height slightly less than width)
    borderRadius: (screenWidth * 0.4) / 2, // Half of the width for a circular image
  },
  avatarLabel: {
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.SECONDARY,
  },
  avatarRow: {
    justifyContent: 'space-around',
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarLabel: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.SECONDARY,
  },
  avatarRow: {
    justifyContent: 'space-between',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  primaryButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    marginRight: 10,
  },
});

export default Onboarding;
