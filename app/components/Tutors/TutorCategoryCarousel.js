import React, { useState } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation  } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const TutorCategoryCarousel = ({ title, tutors }) => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sliderWidth = screenWidth;
  const itemWidth = screenWidth * 0.7;

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TutorDetails')}>
       <View style={styles.cardContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.tutorImage}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(index)}
      >
        <MaterialIcons 
          name={favorites[index] ? 'favorite' : 'favorite-border'} 
          size={24} 
          color={favorites[index] ? '#9835FF' : '#888'} 
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.tutorName}>{item.name}</Text>
          {item.verified && (
            <MaterialCommunityIcons 
              name="check-circle" 
              size={18} 
              color="#9835ff" 
              style={styles.verifiedIcon}
            />
          )}
        </View>
        <Text style={styles.subjects}>{item.subjects.join(', ')}</Text>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>{item.level}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={18} color="#f1c40f" />
          <Text style={styles.ratingText}>{item.ratings} ({item.reviews} reviews)</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
   
  );

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.header}>{title}</Text>
      <Carousel
        data={tutors}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={1}
        inactiveSlideOpacity={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    width: screenWidth * 0.65,
    marginHorizontal: screenWidth * -0.1,
    marginBottom: 20,
    position: 'relative',
  },
  tutorImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  infoContainer: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   gap: 5,
    marginBottom: 5,
  },
  tutorName: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  verifiedIcon: {
    marginLeft: 2,
    marginTop: -4,

  },
  subjects: {
    fontSize: screenWidth * 0.03,
    color: '#888',
    fontFamily: 'Poppins-Medium',
    marginVertical: 5,
  },
  levelContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 5,
  },
  levelText: {
    fontSize: 12,
    color: '#9835ff',
    fontFamily: 'Poppins-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
  header: {
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
});

export default TutorCategoryCarousel;
