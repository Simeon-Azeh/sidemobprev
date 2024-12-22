import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.6;

const renderRecommendedItem = ({ item }) => (
  <TouchableOpacity style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  </TouchableOpacity>
);

const RecommendedResources = ({ resources }) => (
  <View style={styles.container}>
    <Text style={styles.heading}>Recommended Resources</Text>
    <Carousel
      data={resources}
      renderItem={renderRecommendedItem}
      sliderWidth={screenWidth}
      itemWidth={itemWidth}
      inactiveSlideScale={0.9}
      inactiveSlideOpacity={0.7}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    width: itemWidth,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
});

export default RecommendedResources;
