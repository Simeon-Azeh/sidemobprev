import React from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CategoryCoursesCarousel = ({ title, courses }) => {
  const navigation = useNavigation(); // Initialize navigation hook
  const colorScheme = useColorScheme(); // Get the current color scheme
  const sliderWidth = screenWidth;
  const itemWidth = screenWidth * 0.6;

  const handlePress = (courseId) => {
    navigation.navigate('CourseEnrolment', { courseId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.id)}
      style={{
        backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY,
        borderRadius: 8,
        overflow: 'hidden',
        padding: 10,
        width: itemWidth,
        marginHorizontal: screenWidth * -0.16, // Spacing between items
      }}
    >
      <Image
        source={{ uri: item.cover }}
        style={{
          width: '100%',
          height: 150,
          borderRadius: 8,
        }}
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: screenWidth * 0.035, fontFamily: 'Poppins-Medium', color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }}>{item.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="school" size={20} color={colorScheme === 'light' ? '#9835ff' : '#fff'} />
          <Text style={{ marginLeft: 5, fontSize: 14, color: colorScheme === 'light' ? Colors.SECONDARY : '#fff', fontFamily: 'Poppins-Medium' }}>{item.level}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialCommunityIcons name="timelapse" size={18} color={colorScheme === 'light' ? '#a9a9a9' : '#ccc'} />
          <Text style={{ fontSize: 14, color: colorScheme === 'light' ? '#a9a9a9' : '#ccc', marginLeft: 2, fontFamily: 'Poppins-Medium' }}> {item.timeToComplete}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="star" size={20} color="#f1c40f" />
          <Text style={{ marginLeft: 5, fontSize: 14, color: colorScheme === 'light' ? '#a9a9a9' : '#ccc', fontFamily: 'Poppins' }}>{item.ratings} ({item.reviews} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontSize: 20, marginLeft: 20, marginBottom: 10, fontFamily: 'Poppins-Medium', color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }}>{title}</Text>
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