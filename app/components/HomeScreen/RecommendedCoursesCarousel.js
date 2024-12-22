import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons or any other icon set you prefer
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const data = [
  {
    title: 'React Native for Beginners',
    level: 'Advanced',
    image: 'https://img.freepik.com/free-vector/background-abstract-pixel-rain_23-2148371445.jpg?t=st=1723064746~exp=1723068346~hmac=df13cd47dd1ce96ead73617380abffe705eda61371f6f28987f2d25984296a51&w=740',
    timeToComplete: '10 hours',
    ratings: 4.5,
    reviews: 120,
  },
  {
    title: 'Computer Science',
    level: 'Olevel',
    image: 'https://img.freepik.com/free-vector/gradient-top-view-laptop-background_52683-6291.jpg?t=st=1723065545~exp=1723069145~hmac=961c9dd607942a47415ea68a2f399920924699baf5f127abf2fe969091fcf2cc&w=740',
    timeToComplete: '20 hours',
    ratings: 4.7,
    reviews: 98,
  },
  {
    title: 'Flutter for Beginners',
    level: 'Alevel',
    image: 'https://img.freepik.com/free-photo/representations-user-experience-interface-design_23-2150104485.jpg?t=st=1723065936~exp=1723069536~hmac=3efbbbdecb111701557d4631157f58a39ff330892ed93f069213c6701b3df930&w=740',
    timeToComplete: '15 hours',
    ratings: 4.3,
    reviews: 75,
  },
  {
    title: 'Data Structures',
    level: 'Freelance',
    image: 'https://img.freepik.com/free-vector/abstract-modern-big-data-background_23-2147909569.jpg?t=st=1723065989~exp=1723069589~hmac=692192eb5c28dc30dc0905f9b2f8a1e1b29e0c876b80251f39d87e6ef3b7f299&w=740',
    timeToComplete: '8 hours',
    ratings: 4.9,
    reviews: 200,
  },
];

const { width: screenWidth } = Dimensions.get('window');

const sliderWidth = screenWidth;
const itemWidth = screenWidth * 0.6; // Adjust item width to make the next item partly visible

const renderItem = ({ item }) => {
  return (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      padding: 10,
      width: itemWidth,
      height: screenWidth * 0.7,
      marginHorizontal: screenWidth * -0.16, // Spacing between items
    }}>
      <Image
        source={{ uri: item.image }}
        style={{
          width: screenWidth * 0.56,
          height: screenWidth * 0.35,
          borderRadius: 8,
        }}
      />
      <View style={{ padding: 10 }}>
    
        <Text style={{ fontSize: screenWidth * 0.035, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>{item.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="school" size={20} color="#9835ff" />
          <Text style={{ marginLeft: 5, fontSize: 14, color: '#9835ff', fontFamily: 'Poppins-Medium' }}>{item.level}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
        <MaterialCommunityIcons name="timelapse" size={18} color="#a9a9a9" />
        <Text style={{ fontSize: 14, color: '#a9a9a9', marginLeft: 2, fontFamily: 'Poppins-Medium' }}> {item.timeToComplete}</Text>
        </View>
      
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="star" size={20} color="#f1c40f" />
          <Text style={{ marginLeft: 5, fontSize: 14, color: '#a9a9a9', fontFamily: 'Poppins' }}>{item.ratings} ({item.reviews} reviews)</Text>
        </View>
      </View>
    </View>
  );
};

const RecommendedCoursesCarousel = () => {
  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      inactiveSlideScale={0.9} // Adjust scaling of inactive slides
      inactiveSlideOpacity={0.7} // Adjust opacity of inactive slides
      contentContainerCustomStyle={{ overflow: 'visible' }} // Ensure content overflows to show next item partly
    />
  );
};

export default RecommendedCoursesCarousel;
