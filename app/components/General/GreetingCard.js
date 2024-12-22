import { View, Text, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

export default function GreetingCard() {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning,';
    } else if (currentHour < 18) {
      return 'Good afternoon,';
    } else {
      return 'Good evening,';
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center',  gap: 5 }}>
      <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.04, color: Colors.SECONDARY }}>{getGreeting()}</Text>
      <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.05, color: Colors.PRIMARY }}>Simeon Azeh <MaterialIcons name="waving-hand" size={18} color={Colors.SECONDARY} /></Text>
    </View>
  );
}
