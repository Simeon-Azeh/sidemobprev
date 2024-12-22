import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'; // Ensure you have access to navigation

const { width: screenWidth } = Dimensions.get('window');
export default function StatsCard() {
  const navigation = useNavigation(); // Get the navigation object

  const stats = [
    {
      title: 'Saved Courses',
      count: 12,
      icon: 'bookmark',
      screen: 'SavedCourses' // Specify the screen to navigate to
    },
    {
      title: 'Certificates',
      count: 5,
      icon: 'star',
      screen: 'Certificates' // Specify the screen to navigate to
    }
  ];

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, gap: screenWidth * 0.03 }}>
      {stats.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.PRIMARY,
            padding: 15,
            alignItems: 'center',
            width: screenWidth * 0.45, 
          }}
          onPress={() => navigation.navigate(item.screen)} // Navigate to the specified screen
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name={item.icon} size={25} color={Colors.PRIMARY} />
            <Text style={{ fontSize: screenWidth * 0.04, color: Colors.SECONDARY, fontFamily: 'Poppins-Medium', marginTop: 5 }}>
              {item.count}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Text style={{ fontSize: screenWidth * 0.035, fontFamily: 'Poppins-Medium', marginVertical: 5, color: Colors.PRIMARY }}>
              {item.title}
            </Text>
            <MaterialIcons name="chevron-right" size={25} color={Colors.PRIMARY} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
