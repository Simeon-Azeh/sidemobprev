import React from 'react';
import { View, Text, Switch, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../../assets/Utils/Colors';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PreferencesTab({ emailNotifications, setEmailNotifications, pushNotifications, setPushNotifications }) {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={styles.row}>
        <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Email Notifications</Text>
        <Switch 
          value={emailNotifications} 
          onValueChange={setEmailNotifications} 
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }} // Change toggle track color when active
          thumbColor={emailNotifications ? '#9835ff' : Colors.GRAY} // Change toggle thumb color
        />
      </View>
      <View style={styles.row}>
        <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Push Notifications</Text>
        <Switch 
          value={pushNotifications} 
          onValueChange={setPushNotifications} 
          trackColor={{ false: Colors.GRAY, true: '#9835ff' }} // Change toggle track color when active
          thumbColor={pushNotifications ? '#9835ff' : Colors.GRAY} // Change toggle thumb color
        />
      </View>
      <Text style={{ fontFamily: 'Poppins-SemiBold', color: Colors.SECONDARY }}>Notify me when:</Text>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>New course is available</Text>
          <Switch value={true} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor='#9835ff' />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>Account login from new device</Text>
          <Switch value={false} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor={Colors.GRAY} />
        </View>
      </View>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, marginTop: 20 }}>Appearance</Text>
      <Picker style={styles.input}>
        <Picker.Item label="Light" value="light" />
        <Picker.Item label="Dark" value="dark" />
      </Picker>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Language</Text>
      <Picker style={styles.input}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Spanish" value="es" />
      </Picker>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Time Zone</Text>
      <Picker style={styles.input}>
        <Picker.Item label="PST" value="pst" />
        <Picker.Item label="EST" value="est" />
      </Picker>
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
  }
};