import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Switch, ScrollView, Dimensions } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '../../../assets/Utils/Colors';
import Profileavatar from '../../../assets/Images/avatar4.jpg';
import Header from '../../components/General/Header';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoRenewal, setAutoRenewal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileTab />;
      case 'Preferences':
        return <PreferencesTab 
          emailNotifications={emailNotifications} 
          setEmailNotifications={setEmailNotifications}
          pushNotifications={pushNotifications} 
          setPushNotifications={setPushNotifications}
        />;
      case 'Security':
        return <SecurityTab 
          twoFactorAuth={twoFactorAuth} 
          setTwoFactorAuth={setTwoFactorAuth}
        />;
      case 'Payment':
        return <PaymentTab 
          autoRenewal={autoRenewal} 
          setAutoRenewal={setAutoRenewal}
        />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
        {['Profile', 'Preferences', 'Security', 'Payment'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={{
              borderBottomWidth: activeTab === tab ? 2 : 0,
              borderBottomColor: Colors.PRIMARY,
              paddingBottom: 1,
            }}
          >
            <Text style={{ 
              fontSize: screenWidth * 0.035, 
              fontFamily: 'Poppins-Medium',
              color: activeTab === tab ? Colors.PRIMARY : Colors.SECONDARY,
            }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

function ProfileTab() {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={Profileavatar} style={{ width: screenWidth * 0.2, height: screenWidth * 0.2, borderRadius: 50 }} />
        <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: screenWidth * 0.36, backgroundColor: 'white', borderRadius: 50, width: screenWidth * 0.08, height: screenWidth * 0.08, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="camera-plus-outline" size={26} color={Colors.PRIMARY}  />
        </TouchableOpacity>
      </View>
      <TextInput placeholder="First Name" style={styles.input} value="Simeon Azeh" />
      <TextInput placeholder="Last Name" style={styles.input} value="Kongnyuy" />
      <TextInput placeholder="Username" style={styles.input} value="Simeon Azeh" />
      <TextInput placeholder="Email" style={styles.input} value="simeonazeh6@gmail.com" />
      <TextInput placeholder="Phone Number" style={styles.input} value="+250798654693" />
      <TextInput placeholder="Address" style={styles.input} value="123 Main St" />
      <TextInput placeholder="State" style={styles.input} value="Kigali" />
      <TextInput placeholder="City" style={styles.input} value="Rwanda" />
      <TextInput placeholder="Bio" style={[styles.input, { height: screenHeight * 0.08 }]} multiline value="Software Engineering student" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

function PreferencesTab({ emailNotifications, setEmailNotifications, pushNotifications, setPushNotifications }) {
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

function SecurityTab({ twoFactorAuth, setTwoFactorAuth }) {
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

function PaymentTab({ autoRenewal, setAutoRenewal }) {
  const navigation = useNavigation();
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03 }}>Your Plan</Text>
      <View style={{ marginVertical: 20 }}>
        <PlanCard name="Free" price="$0/month" description="Basic access" active />
        <PlanCard name="Standard" price="$9.99/year" description="Standard features" />
        <PlanCard name="Premium" price="$19.99/year" description="All features and courses" />
      </View>
      <View style={styles.row}>
        <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03 }}>Auto Renewal</Text>
        <Switch value={autoRenewal} onValueChange={setAutoRenewal} trackColor={{ false: Colors.GRAY, true: '#9835ff' }} thumbColor={Colors.GRAY} />
      </View>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03 }}>Payment Methods</Text>
      <PaymentMethodCard method="Credit Card" icon="credit-card" />
      <PaymentMethodCard method="PayPal" icon="paypal" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PaymentPage')}>
        <Text style={styles.buttonText}>Billing Information</Text>
      </TouchableOpacity>
      <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.03, marginTop: 20 }}>Billing History</Text>
      <View style={styles.billingHistory}>
        <View style={styles.billingRow}>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Date</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Reason</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Amount</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Invoice</Text>
        </View>
        <View style={styles.billingRow}>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>01/08/2024</Text>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>Subscription</Text>
          <Text style={{ fontFamily: 'Poppins', color: Colors.SECONDARY }}>$9.99</Text>
          <TouchableOpacity >
            <Text style={{ color: Colors.PRIMARY, fontFamily: 'Poppins-Medium' }}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function PlanCard({ name, price, description, active }) {
  return (
    <TouchableOpacity style={[styles.planCard, active && styles.activePlan]}>
      <Text style={{ fontSize: screenWidth * 0.04, fontFamily: 'Poppins-Medium', color: active ? Colors.WHITE : Colors.SECONDARY }}>{name}</Text>
      <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', color: active ? Colors.WHITE : Colors.SECONDARY }}>{price}</Text>
      <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', color: active ? Colors.WHITE : Colors.SECONDARY }}>{description}</Text>
      {active ? (
        <TouchableOpacity style={styles.planButton}>
          <Text style={{ color: Colors.PRIMARY, fontFamily: 'Poppins-Medium' }}>Cancel Subscription</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{ ...styles.planButton, backgroundColor: Colors.PRIMARY }}>
          <Text style={{ color: Colors.WHITE, fontFamily: 'Poppins-Medium' }}>Select Plan</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

function PaymentMethodCard({ method, icon }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
      <FontAwesome name={icon} size={24} color={Colors.SECONDARY} />
      <Text style={{ marginLeft: 10 }}>{method}</Text>
    </View>
  );
}

const styles = {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center'
  },
  planCard: {
    padding: 20,
    backgroundColor: '#F9FBFE',
    borderRadius: 10,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    marginBottom: 10,
  },
  activePlan: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY
  },
  planButton: {
    marginTop: 10,
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center'
  },
  billingHistory: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 5,
    padding: 10
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  }
};
