import React from 'react';
import { View, Text, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');
const { height: screenHeight } = Dimensions.get('window');

export default function SecurityTab({ twoFactorAuth, setTwoFactorAuth }) {
  const navigation = useNavigation();
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={styles.row}>
        <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Two-Factor Authentication</Text>
        <Switch 
          value={twoFactorAuth} 
          onValueChange={setTwoFactorAuth} 
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }} // Change toggle track color when active
          thumbColor={twoFactorAuth ? '#9835ff' : Colors.GRAY} // Change toggle thumb color
        />
      </View>
      <Text style={{ fontFamily: 'Poppins-SemiBold', color: Colors.SECONDARY }}>Privacy Settings</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>Make my account private</Text>
        <Switch value={true} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor='#9835ff' />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>Show my online status</Text>
        <Switch value={false} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor={Colors.GRAY} />
      </View>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center'
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
  }
};