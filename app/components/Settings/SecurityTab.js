import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Dimensions, StyleSheet, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SecurityTab({ twoFactorAuth, setTwoFactorAuth }) {
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeButtonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
  const themeButtonBorderStyle = colorScheme === 'dark' ? styles.darkButtonBorder : {};

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await sendPasswordResetEmail(auth, user.email);
        Alert.alert('Success', 'Password reset email sent successfully!');
      } else {
        Alert.alert('Error', 'No authenticated user found.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send password reset email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <View style={styles.row}>
        <Text style={[styles.label, themeTextStyle]}>Two-Factor Authentication</Text>
        <Switch 
          value={twoFactorAuth} 
          onValueChange={setTwoFactorAuth} 
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }} // Change toggle track color when active
          thumbColor={twoFactorAuth ? '#9835ff' : Colors.GRAY} // Change toggle thumb color
        />
      </View>
      <Text style={[styles.sectionHeader, themeTextStyle]}>Privacy Settings</Text>
      <View style={styles.row}>
        <Text style={[styles.label, themeTextStyle]}>Make my account private</Text>
        <Switch value={true} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor='#9835ff' />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, themeTextStyle]}>Show my online status</Text>
        <Switch value={false} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor={Colors.GRAY} />
      </View>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={[styles.button, themeButtonStyle, themeButtonBorderStyle]} onPress={handleResetPassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  lightContainer: {
    backgroundColor: Colors.WHITE,
  },
  darkContainer: {
    backgroundColor: Colors.DARK_BACKGROUND,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.04,
  },
  lightText: {
    color: Colors.SECONDARY,
  },
  darkText: {
    color: Colors.DARK_TEXT,
  },
  sectionHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: screenWidth * 0.045,
    marginVertical: 15,
  },
  lightButton: {
    backgroundColor: Colors.PRIMARY,
  },
  darkButton: {
    backgroundColor: Colors.DARK_BUTTON,
    borderColor: Colors.DARK_BORDER,
    borderWidth: 1,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: screenHeight * 0.02, 
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});