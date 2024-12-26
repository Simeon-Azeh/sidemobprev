import { View, Text, Dimensions, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function GreetingCard() {
  const [userName, setUserName] = useState('');
  const colorScheme = useColorScheme();

  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themePrimaryColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;
  const themeNameColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;

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

  const getMotivation = () => {
    const morningMotivations = [
      "Start your day with a positive mindset!",
      "Today is a new opportunity to learn something new.",
      "Rise and shine! Let's make today productive."
    ];
    const afternoonMotivations = [
      "Keep pushing forward, you're doing great!",
      "Take a deep breath and keep going.",
      "You're halfway through the day, stay focused!"
    ];
    const eveningMotivations = [
      "Reflect on what you've learned today.",
      "Great job today! Time to relax and recharge.",
      "End your day with a sense of accomplishment."
    ];

    const currentHour = new Date().getHours();
    let motivations;
    if (currentHour < 12) {
      motivations = morningMotivations;
    } else if (currentHour < 18) {
      motivations = afternoonMotivations;
    } else {
      motivations = eveningMotivations;
    }

    const randomIndex = Math.floor(Math.random() * motivations.length);
    return motivations[randomIndex];
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text style={[styles.greetingText, { color: themeTextColor }]}>{getGreeting()}</Text>
        <Text style={[styles.userNameText, { color: themeNameColor }]}>
          {userName} <MaterialIcons name="waving-hand" size={18} color={themeNameColor} />
        </Text>
      </View>
      <View style={styles.motivationContainer}>
        <MaterialIcons name="lightbulb" size={18} color={themePrimaryColor} />
        <Text style={[styles.motivationText, { color: themeTextColor }]}>{getMotivation()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  greetingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.04,
  },
  userNameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.05,
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  motivationText: {
    fontFamily: 'Poppins',
    fontSize: screenWidth * 0.035,
    marginLeft: 5,
  },
});