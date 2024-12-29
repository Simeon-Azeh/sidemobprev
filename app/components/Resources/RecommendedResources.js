import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useColorScheme } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.6;

const renderRecommendedItem = ({ item }) => {
  const colorScheme = useColorScheme(); // Get the current color scheme
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>{`Q ${item.year}`}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>{item.title}</Text>
        <Text style={[styles.cardDescription, { color: colorScheme === 'light' ? '#333' : '#ccc' }]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const RecommendedResources = ({ resources }) => {
  const colorScheme = useColorScheme(); // Get the current color scheme
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>Recommended Resources</Text>
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
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    width: itemWidth,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: screenWidth * 0.1,
    color: '#a9a9a9',
    opacity: 0.5,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default RecommendedResources;