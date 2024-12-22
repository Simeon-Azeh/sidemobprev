import { View, Text, Image, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, StyleSheet, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import ForgotImg from '../../../assets/Images/ForgotImg.png';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebaseConfig'; // Adjust the path as necessary

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address.');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      navigation.navigate('Login');
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
            source={ForgotImg} 
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
              Forgot Password?
            </Text>
            <Text style={{ 
              color: Colors.WHITE, 
              fontSize: screenWidth * 0.035, 
              fontWeight: '500', 
              textAlign: 'center', 
              fontFamily: 'Poppins-Medium', 
              marginTop: 1 
            }}>
              No worries! Just enter your email and we will send you a link to reset your password
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
              <TouchableOpacity
                onPress={handleResetPassword}
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
                    Reset Password
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
                Don't have an account?
              </Text>
              <Text 
                style={{ 
                  color: Colors.WHITE, 
                  fontSize: screenWidth * 0.035, 
                  fontWeight: '500', 
                  fontFamily: 'Poppins-Medium',  
                  marginLeft: 5
                }}  
                onPress={() => navigation.navigate('Register')}
              >
                Create Account
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