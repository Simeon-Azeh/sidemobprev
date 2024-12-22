// Components/Resources/ResourceCategoryCarousel.js
import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.6;

const ResourceCategoryCarousel = ({ title, data }) => {
  const navigation = useNavigation(); // Initialize navigation hook

  const handlePress = (item) => {
    navigation.navigate('ResourceData', { resource: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', padding: 10, width: itemWidth, marginHorizontal: screenWidth * -0.16 }}
    >
      <Image source={{ uri: item.image }} style={{ width: screenWidth * 0.56, height: screenWidth * 0.35, borderRadius: 8 }} />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: screenWidth * 0.035, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>{item.subject}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="library-books" size={20} color="#9835ff" />
          <Text style={{ marginLeft: 5, fontSize: 14, color: '#9835ff', fontFamily: 'Poppins-Medium' }}>{item.examType}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <Entypo name="line-graph" size={18} color="#a9a9a9" />
          <Text style={{ fontSize: 14, color: '#a9a9a9', marginLeft: 2, fontFamily: 'Poppins-Medium' }}>{item.level}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="star" size={20} color="#f1c40f" />
          <Text style={{ marginLeft: 5, fontSize: 14, color: '#a9a9a9', fontFamily: 'Poppins-Medium' }}>{item.ratings} ({item.reviews} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 20, marginLeft: 20, marginBottom: 10, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>{title}</Text>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
      />
    </View>
  );
};

export default ResourceCategoryCarousel;
