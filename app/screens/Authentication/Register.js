import { View, Text, Image, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
import RegisterImg from '../../../assets/Images/RegisterImg.png';
import Colors from '../../../assets/Utils/Colors';
import GoogleIcon from '../../../assets/Images/GoogleIcon.png';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebaseConfig'; // Adjust the path as necessary
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const db = getFirestore();

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const createUserDocument = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        emailVerified: false,
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };

  const checkOnboardingStatus = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists() && userDoc.data().onboardingCompleted) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(userCredential.user);
      
      const isOnboarded = await checkOnboardingStatus(userCredential.user.uid);
      navigation.navigate(isOnboarded ? 'Drawer' : 'Onboarding');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('The email address is already in use by another account.');
          break;
        case 'auth/invalid-email':
          setErrorMessage('The email address is not valid. Please enter a valid email.');
          break;
        case 'auth/missing-password':
          setErrorMessage('The password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/operation-not-allowed':
          setErrorMessage('Email/password accounts are not enabled. Please contact support.');
          break;
        case 'auth/network-request-failed':
          setErrorMessage('A network error occurred. Please check your internet connection and try again.');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Too many attempts. Please try again later.');
          break;
        default:
          setErrorMessage('An unexpected error occurred: ' + error.message);
          break;
      }
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithRedirect(auth, provider);
      await createUserDocument(userCredential.user);
      
      const isOnboarded = await checkOnboardingStatus(userCredential.user.uid);
      navigation.navigate(isOnboarded ? 'Drawer' : 'Onboarding');
    } catch (error) {
      setErrorMessage(error.message);
      setModalVisible(true);
    } finally {
      setLoading(false);
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
        <View style={{ flex: 1 }}>
          <Image 
            source={RegisterImg} 
            style={{ 
              width: screenWidth * 0.8, 
              height: screenHeight * 0.4, 
              alignSelf: 'center', 
              resizeMode: 'contain',
              marginTop: 10 // Adjusted to bring image up
            }} 
          />
          <View style={{
            flex: 1, // Ensure it takes up the remaining space
            backgroundColor: Colors.PRIMARY,
            width: '100%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingTop: 20, // Add padding at the top for better spacing
            justifyContent: 'center', // Center the content vertically
          }}>
            <Text style={{ 
              color: Colors.WHITE, 
              fontSize: screenWidth * 0.06, 
              textAlign: 'center', 
              fontFamily: 'Poppins-Medium', 
              marginTop: 1 
            }}>
              Ready to get started?
            </Text>
            <Text style={{ 
              color: Colors.WHITE, 
              fontSize: screenWidth * 0.035, 
              fontWeight: '500', 
              textAlign: 'center', 
              fontFamily: 'Poppins-Medium', 
              marginTop: 1 
            }}>
              Create an account to get awesome!
            </Text>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <TextInput
                autoCompleteType="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                style={{ 
                  width: screenWidth * 0.9, 
                  height: screenHeight * 0.06, 
                  borderRadius: 10, 
                  marginTop: 20, 
                  borderWidth: 1, 
                  borderColor: Colors.WHITE, 
                  backgroundColor: Colors.WHITE, 
                  paddingLeft: 20, 
                  color: Colors.SECONDARY, 
                  fontFamily: 'Poppins-Medium', 
                  fontSize: screenWidth * 0.035
                }}
              />
              <View style={{ marginTop: 20 }}>
                <TextInput
                  autoCompleteType="password"
                  secureTextEntry={!passwordVisible}
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                  style={{ 
                    width: screenWidth * 0.9, 
                    height: screenHeight * 0.06, 
                    borderRadius: 10, 
                    borderWidth: 1, 
                    borderColor: Colors.WHITE, 
                    backgroundColor: Colors.WHITE, 
                    paddingLeft: 20, 
                    color: Colors.SECONDARY, 
                    fontFamily: 'Poppins-Medium', 
                    fontSize: screenWidth * 0.035 
                  }}
                />
                <TouchableOpacity 
                  onPress={() => setPasswordVisible(!passwordVisible)} 
                  style={styles.eyeIcon}
                >
                  <Feather name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 20 }}>
                <TextInput
                  autoCompleteType="password"
                  secureTextEntry={!passwordVisible}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={{ 
                    width: screenWidth * 0.9, 
                    height: screenHeight * 0.06, 
                    borderRadius: 10, 
                    borderWidth: 1, 
                    borderColor: Colors.WHITE, 
                    backgroundColor: Colors.WHITE, 
                    paddingLeft: 20, 
                    color: Colors.SECONDARY, 
                    fontFamily: 'Poppins-Medium', 
                    fontSize: screenWidth * 0.035 
                  }}
                />
                <TouchableOpacity 
                  onPress={() => setPasswordVisible(!passwordVisible)} 
                  style={styles.eyeIcon}
                >
                  <Feather name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleRegister}
                style={{
                  width: screenWidth * 0.9,
                  height: screenHeight * 0.06,
                  borderRadius: 10,
                  marginTop: 20,
                  backgroundColor: Colors.WHITE,
                  borderWidth: 1,
                  borderColor: Colors.WHITE,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.PRIMARY} />
                ) : (
                  <Text style={{ 
                    color: Colors.PRIMARY, 
                    fontFamily: 'Poppins-Medium', 
                    fontSize: screenWidth * 0.035 
                  }}>
                    Register
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <Text style={{ 
              color: Colors.WHITE, 
              fontSize: screenWidth * 0.035, 
              fontWeight: '500', 
              textAlign: 'center', 
              fontFamily: 'Poppins-Medium', 
              marginTop: 20 
            }}>
              - Or -
            </Text>
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                backgroundColor: Colors.WHITE, 
                width: screenWidth * 0.9, 
                height: screenHeight * 0.06, 
                borderRadius: 10, 
                marginTop: 10, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
              onPress={handleGoogleAuth}
              disabled={loading}
            >
              <Image source={GoogleIcon} style={{ width: 35, height: 35 }} />
              <Text style={{ 
                fontSize: screenWidth * 0.035, 
                color: Colors.SECONDARY, 
                marginLeft: 10, 
                fontFamily: 'Poppins-Medium' 
              }}>
                Continue with Google
              </Text>
            </TouchableOpacity>
            <View style={{ 
              flexDirection: 'row', 
              marginTop: 20,
              justifyContent: 'center' 
            }}>
              <Text style={{ 
                color: Colors.WHITE, 
                fontSize: screenWidth * 0.035, 
                fontWeight: '500', 
                fontFamily: 'Poppins-Medium',  
              }}>
                Already have an account?
              </Text>
              <Text 
                style={{ 
                  color: Colors.WHITE, 
                  fontSize: screenWidth * 0.035, 
                  fontWeight: '500', 
                  fontFamily: 'Poppins-Medium',  
                  marginLeft: 5
                }}  
                onPress={() => navigation.navigate('Login')}
              >
                Login
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
    zIndex: 1,
    color: '#9835FF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adds a dimmed background for better focus
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    width: '90%', // Wider modal for better content placement
  },
  button: {
    borderRadius: 10, // More rounded button
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: Colors.PRIMARY, // Ensure Colors.PRIMARY is a good accent color
  },
  textStyle: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16, // Slightly larger for readability
    fontFamily: 'Poppins', // Use a more readable font
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    color: '#333', // Neutral color for better readability
    lineHeight: 24, // Improved spacing for multi-line text
    fontFamily: 'Poppins',
  },
});