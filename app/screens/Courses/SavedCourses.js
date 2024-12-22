import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons or any other icon set you prefer
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const savedCoursesData = [
  {
    title: 'React Native for Beginners',
    level: 'Advanced',
    image: 'https://img.freepik.com/free-vector/background-abstract-pixel-rain_23-2148371445.jpg?t=st=1723064746~exp=1723068346~hmac=df13cd47dd1ce96ead73617380abffe705eda61371f6f28987f2d25984296a51&w=740',
    timeToComplete: '10 hours',
    ratings: 4.5,
    reviews: 120,
  },
 
  {
    title: 'Flutter for Beginners',
    level: 'Alevel',
    image: 'https://img.freepik.com/free-photo/representations-user-experience-interface-design_23-2150104485.jpg?t=st=1723065936~exp=1723069536~hmac=3efbbbdecb111701557d4631157f58a39ff330892ed93f069213c6701b3df930&w=740',
    timeToComplete: '15 hours',
    ratings: 4.3,
    reviews: 75,
  },
 
];

const SavedCourses = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      {savedCoursesData.map((course, index) => (
        <View key={index} style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          overflow: 'hidden',
          padding: 10,
          marginBottom: 20,
        }}>
          <Image
            source={{ uri: course.image }}
            style={{
              width: '100%',
              height: 150,
              borderRadius: 8,
            }}
          />
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>{course.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <MaterialIcons name="school" size={20} color="#9835ff" />
              <Text style={{ marginLeft: 5, fontSize: 14, color: '#9835ff', fontFamily: 'Poppins-Medium' }}>{course.level}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <MaterialCommunityIcons name="timelapse" size={18} color="#a9a9a9" />
              <Text style={{ fontSize: 14, color: '#a9a9a9', marginLeft: 2, fontFamily: 'Poppins-Medium' }}>{course.timeToComplete}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <MaterialIcons name="star" size={20} color="#f1c40f" />
              <Text style={{ marginLeft: 5, fontSize: 14, color: '#a9a9a9', fontFamily: 'Poppins' }}>{course.ratings} ({course.reviews} reviews)</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default SavedCourses;
