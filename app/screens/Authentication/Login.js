import { View, Text, Image, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React from 'react';
import LoginImg from '../../../assets/Images/LoginImg.png';
import Colors from '../../../assets/Utils/Colors';
import GoogleIcon from '../../../assets/Images/GoogleIcon.png';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Drawer'); // Navigate to the Drawer Navigator
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
            source={LoginImg} 
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
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
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
              Welcome Back!
            </Text>
            <Text style={{ 
              color: Colors.WHITE, 
              fontSize: screenWidth * 0.035, 
              fontWeight: '500', 
              textAlign: 'center', 
              fontFamily: 'Poppins-Medium', 
              marginTop: 1 
            }}>
              Log in to your account
            </Text>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <TextInput
                autoCompleteType="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="Enter Email"
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
              <TextInput
                autoCompleteType="password"
                secureTextEntry={true}
                placeholder="Enter Password"
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
              <Text 
                style={{ 
                  color: Colors.WHITE, 
                  fontSize: screenWidth * 0.035, 
                  fontWeight: '500', 
                  textAlign: 'right', 
                  fontFamily: 'Poppins-Medium', 
                  marginTop: 10, 
                  marginLeft: 'auto', 
                  marginRight: 20 
                }} 
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                Forgot Password?
              </Text>
              <TouchableOpacity
                onPress={handleLogin}
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
              >
                <Text style={{ 
                  color: Colors.PRIMARY, 
                  fontFamily: 'Poppins-Medium', 
                  fontSize: screenWidth * 0.035 
                }}>
                  Log In
                </Text>
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
    </KeyboardAvoidingView>
  );
}
