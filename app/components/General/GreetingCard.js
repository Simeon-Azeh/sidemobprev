import { View, Text, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

export default function GreetingCard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(getFirestore(), 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.firstName || auth.currentUser.email);
      } else {
        setUserName(auth.currentUser.email);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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