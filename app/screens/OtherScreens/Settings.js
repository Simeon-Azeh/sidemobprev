import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Header from '../../components/General/Header';
import Colors from '../../../assets/Utils/Colors';
import ProfileTab from '../../components/Settings/ProfileTab';
import PreferencesTab from '../../components/Settings/PreferencesTab';
import SecurityTab from '../../components/Settings/SecurityTab';
import PaymentTab from '../../components/Settings/PaymentTab';

const { width: screenWidth } = Dimensions.get('window');

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