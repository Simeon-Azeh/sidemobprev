import React from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const CategoryCoursesCarousel = ({ title, courses }) => {
  const navigation = useNavigation(); // Initialize navigation hook
  const sliderWidth = screenWidth;
  const itemWidth = screenWidth * 0.6;

  const handlePress = (course) => {
    navigation.navigate('CourseEnrolment', { course });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        padding: 10,
        width: itemWidth,
        marginHorizontal: screenWidth * -0.16, // Spacing between items
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: '100%',
          height: 150,
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
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontSize: 20, marginLeft: 20, marginBottom: 10, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>{title}</Text>
      <Carousel
        data={courses}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
      />
    </View>
  );
};

export default CategoryCoursesCarousel;
