import React from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons or any other icon set you prefer
import * as Progress from 'react-native-progress'; // Import the progress circle component
import Header from '../../components/General/Header';
import GreetingCard from '../../components/General/GreetingCard';
import Colors from '../../../assets/Utils/Colors';
import StatsCard from '../../components/HomeScreen/StatsCard';
import BarChart from '../../components/HomeScreen/BarChart';
import RecommendedCoursesCarousel from '../../components/HomeScreen/RecommendedCoursesCarousel';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const data = [
  {
    title: 'Ultimate Python',
    category: 'Programming',
    image: 'https://img.freepik.com/free-vector/colourful-illustration-programmer-working_23-2148281410.jpg?t=st=1723237216~exp=1723240816~hmac=7b9fc680514a272e0023377b9dab951e498ad209b16097797a8a85b56e66dd6a&w=740',
    progress: 0.4, // Progress for the course (40%)
  },
  {
    title: 'Computer Science',
    category: 'Science',
    image: 'https://img.freepik.com/free-vector/gradient-top-view-laptop-background_52683-6291.jpg?t=st=1723065545~exp=1723069145~hmac=961c9dd607942a47415ea68a2f399920924699baf5f127abf2fe969091fcf2cc&w=740',
    progress: 0.7, // Progress for the course (70%)
  },
  {
    title: 'Flutter for Beginners',
    category: 'Programming',
    image: 'https://img.freepik.com/free-photo/representations-user-experience-interface-design_23-2150104485.jpg?t=st=1723065936~exp=1723069536~hmac=3efbbbdecb111701557d4631157f58a39ff330892ed93f069213c6701b3df930&w=740',
    progress: 0.5, // Progress for the course (50%)
  },
  {
    title: 'Data Structures',
    category: 'Education',
    image: 'https://img.freepik.com/free-vector/abstract-modern-big-data-background_23-2147909569.jpg?t=st=1723065989~exp=1723069589~hmac=692192eb5c28dc30dc0905f9b2f8a1e1b29e0c876b80251f39d87e6ef3b7f299&w=740',
    progress: 0.9, // Progress for the course (90%)
  },
];

export default function HomeScreen() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const navigation = useNavigation();

  const sliderWidth = screenWidth;
  const itemWidth = screenWidth * 0.8; // Adjust item width as needed

  const renderItem = ({ item }) => {
    return (
      <View style={{
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 10,
        width: itemWidth,
        height: 120,
        marginHorizontal: screenWidth * -0.06, // Spacing between items
        paddingHorizontal: 20,
        marginBottom: 20,
      }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: screenWidth * 0.15,
            height: screenWidth * 0.15,
            borderRadius: 50,
           marginTop: screenHeight * 0.015,
            borderWidth: 1,
            borderColor: Colors.WHITE,
          }}
        />
        <View style={{
          flex: 1,
          marginLeft: 10,
          justifyContent: 'center',
        }}>
        
          <Text style={{
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            color: Colors.WHITE,
          }}>{item.title}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
            <MaterialIcons
              name="category" // Replace with the appropriate icon name
              size={14}
              color={Colors.LIGHT_GRAY}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontSize: 14,
              color: Colors.LIGHT_GRAY,
            }}>{item.category}</Text>
          </View>
        </View>
        <Progress.Circle
          size={50}
          progress={item.progress}
          showsText
          formatText={() => `${Math.round(item.progress * 100)}%`} // Display progress as percentage
          color={Colors.WHITE}
          style={{
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView>
        <View style={{ paddingHorizontal: 15, marginVertical: 15 }}>
          <GreetingCard />
        </View>
        <View>
          <Carousel
            data={data}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            inactiveSlideScale={0.9} // Optional: Adjust scaling of inactive slides
            inactiveSlideOpacity={0.7} // Optional: Adjust opacity of inactive slides
          />
           <TouchableOpacity style={{ marginTop: 0,marginBottom: 10, borderWidth: 1, borderColor: Colors.PRIMARY, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', display: 'flex', width: '40%', alignSelf: 'center', backgroundColor: Colors.WHITE, flexDirection: 'row' }} onPress={() => navigation.navigate('EnrolledCourses')}>
            <Text style={{ color: Colors.PRIMARY, fontSize: screenWidth * 0.029, fontFamily: 'Poppins-Medium', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>Enrolled Courses <Feather name="chevron-right" size={14} color={Colors.PRIMARY} style={{ paddingTop: 10, marginTop: 10 }} /></Text>
          </TouchableOpacity>
          
        </View>
       
        <View style={{ paddingHorizontal: 10 }}>
          <StatsCard />
        </View>
        <View>
          <BarChart/>
        </View>
        <View style={{  marginBottom: 20 }}>
        <Text style={{ fontSize: screenWidth * 0.045, marginBottom: 10, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, marginLeft: 20 }}>
        Recommended for you
      </Text>
          <RecommendedCoursesCarousel />
      
          <TouchableOpacity style={{ marginTop: 20,marginBottom: 10, borderWidth: 1, borderColor: Colors.PRIMARY, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', display: 'flex', width: '40%', alignSelf: 'center', backgroundColor: Colors.WHITE }} onPress={() => navigation.navigate('Courses')}>
            <Text style={{ color: Colors.PRIMARY, fontSize: screenWidth * 0.029, fontFamily: 'Poppins-Medium', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', textAlign: 'center', flexDirection: 'row' }}>View More <Feather name="chevron-right" size={14} color={Colors.PRIMARY} style={{ paddingTop: 10, marginTop: 10 }} /></Text>
          </TouchableOpacity>
          
        
        </View>
      </ScrollView>
    </View>
  );
}
