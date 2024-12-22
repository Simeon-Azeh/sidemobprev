import { View, Text, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';

const { width: screenWidth } = Dimensions.get('window');

export default function GreetingCard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.firstName || user.email);
          } else {
            setUserName(user.email);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, []);

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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.04, color: Colors.SECONDARY }}>{getGreeting()}</Text>
      <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.05, color: Colors.PRIMARY }}>
        {userName} <MaterialIcons name="waving-hand" size={18} color={Colors.SECONDARY} />
      </Text>
    </View>
  );
}