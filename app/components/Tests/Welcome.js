import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import TestImg from '../../../assets/Images/OnlineTest.png';
import Colors from '../../../assets/Utils/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Welcome() {
  const navigation = useNavigation(); // Use the useNavigation hook

  return (
    <View>
      <View>
        <Image 
          source={TestImg} 
          style={{ width: screenWidth * 0.8, height: screenHeight * 0.5, alignSelf: 'center', objectFit: 'contain' }} 
        />
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: screenWidth * 0.05, fontFamily: 'Poppins-Medium', textAlign: 'center', color: Colors.SECONDARY }}>
          Welcome To Online Tests
        </Text>
        <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', textAlign: 'center', color: '#888' }}>
          We've built a sample of your GCE Mock exam to get you ready anyday, anytime. Get your scores in realtime.
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, alignSelf: 'center', padding: 10, paddingHorizontal: 20, backgroundColor: Colors.PRIMARY, borderRadius: 10 }}
          onPress={() => navigation.navigate('QuizChoice')} // Navigate to QuizChoice
        >
          <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', textAlign: 'center', color: Colors.WHITE }}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
