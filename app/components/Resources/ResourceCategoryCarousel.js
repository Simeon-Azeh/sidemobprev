import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.6;

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const ResourceCategoryCarousel = ({ title, data }) => {
  const [viewMode, setViewMode] = useState('carousel'); // Default view mode
  const navigation = useNavigation(); // Initialize navigation hook
  const colorScheme = useColorScheme(); // Get the current color scheme

  const handlePress = (item) => {
    navigation.navigate('ResourceDocs', {
      images: item.images,
      title: item.title,
      exam: item.exam,
      year: item.year,
      level: item.level,
      totalPages: item.totalPages,
      paper: item.paper,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={[
        styles.itemContainer,
        { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY },
      ]}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>{`Q ${item.year}`}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.subject, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>
          {capitalizeFirstLetter(item.title)}
        </Text>
        <View style={styles.row}>
          <FontAwesome name="book" size={20} color={colorScheme === 'light' ? '#9835ff' : '#fff'} />
          <Text style={[styles.examType, { color: colorScheme === 'light' ? '#9835ff' : '#fff' }]}>
            {item.exam ? item.exam.toUpperCase() : item.title.toUpperCase()}
          </Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="line-chart" size={18} color={colorScheme === 'light' ? '#a9a9a9' : '#fff'} />
          <Text style={[styles.level, { color: colorScheme === 'light' ? '#a9a9a9' : '#fff' }]}>{item.level}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="file-text" size={20} color={colorScheme === 'light' ? '#a9a9a9' : '#fff'} />
          <Text style={[styles.details, { color: colorScheme === 'light' ? '#a9a9a9' : '#fff' }]}>
            {`${item.paper ? item.paper.toUpperCase() : 'UNKNOWN'} ${item.year}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={[
        styles.gridItemContainer,
        { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY },
      ]}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>{`Q ${item.year}`}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.subject, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>
          {capitalizeFirstLetter(item.title)}
        </Text>
        <View style={styles.row}>
          <FontAwesome name="book" size={20} color={colorScheme === 'light' ? '#9835ff' : '#fff'} />
          <Text style={[styles.examType, { color: colorScheme === 'light' ? '#9835ff' : '#fff' }]}>
            {item.exam ? item.exam.toUpperCase() : item.title.toUpperCase()}
          </Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="line-chart" size={18} color={colorScheme === 'light' ? '#a9a9a9' : '#fff'} />
          <Text style={[styles.level, { color: colorScheme === 'light' ? '#a9a9a9' : '#fff' }]}>{item.level}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="file-text" size={20} color={colorScheme === 'light' ? '#a9a9a9' : '#fff'} />
          <Text style={[styles.details, { color: colorScheme === 'light' ? '#a9a9a9' : '#fff' }]}>
            {`${item.paper ? item.paper.toUpperCase() : 'UNKNOWN'} ${item.year}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={[
        styles.listItemContainer,
        { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY },
      ]}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>{`Q ${item.year}`}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.subject, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>
          {capitalizeFirstLetter(item.title)}
        </Text>
        <View style={styles.row}>
          <FontAwesome name="book" size={20} color={colorScheme === 'light' ? '#9835ff' : '#fff'} />
          <Text style={[styles.examType, { color: colorScheme === 'light' ? '#9835ff' : '#fff' }]}>
            {item.exam ? item.exam.toUpperCase() : item.title.toUpperCase()}
          </Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="line-chart" size={18} color={colorScheme === 'light' ? '#a9a9a9' : '#fff'} />
          <Text style={[styles.level, { color: colorScheme === 'light' ? '#a9a9a9' : '#fff' }]}>{item.level}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="file-text" size={20} color={colorScheme === 'light' ? '#a9a9a9' : '#fff'} />
          <Text style={[styles.details, { color: colorScheme === 'light' ? '#a9a9a9' : '#fff' }]}>
            {`${item.paper ? item.paper.toUpperCase() : 'UNKNOWN'} ${item.year}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>{title}</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity onPress={() => setViewMode('carousel')}>
            <MaterialIcons name="view-carousel" size={24} color={viewMode === 'carousel' ? (colorScheme === 'light' ? Colors.PRIMARY : '#fff') : (colorScheme === 'light' ? Colors.SECONDARY : '#aaa')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode('grid')}>
            <MaterialIcons name="view-module" size={24} color={viewMode === 'grid' ? (colorScheme === 'light' ? Colors.PRIMARY : '#fff') : (colorScheme === 'light' ? Colors.SECONDARY : '#aaa')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode('list')}>
            <MaterialIcons name="view-list" size={24} color={viewMode === 'list' ? (colorScheme === 'light' ? Colors.PRIMARY : '#fff') : (colorScheme === 'light' ? Colors.SECONDARY : '#aaa')} />
          </TouchableOpacity>
        </View>
      </View>
      {viewMode === 'carousel' && (
        <Carousel
          data={data}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.7}
        />
      )}
      {viewMode === 'grid' && (
        <FlatList
          data={data}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridColumn}
        />
      )}
      {viewMode === 'list' && (
        <FlatList
          data={data}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  viewToggle: {
    flexDirection: 'row',
  },
  itemContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    width: itemWidth,
    marginHorizontal: screenWidth * -0.16,
  },
  gridItemContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    width: screenWidth * 0.48,
    margin: screenWidth * 0.012, // Reduced margin for grid items
  },
  listItemContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    width: screenWidth * 0.9,
    marginVertical: 5,
    alignSelf: 'center',
  },
  imageContainer: {
    width: '100%',
    height: screenWidth * 0.35,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: screenWidth * 0.1,
    color: '#a9a9a9',
    opacity: 0.5,
    fontFamily: 'Poppins-Medium',
  },
  textContainer: {
    padding: 10,
  },
  subject: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  examType: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  level: {
    fontSize: 14,
    marginLeft: 2,
    fontFamily: 'Poppins-Medium',
  },
  details: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Poppins-Medium',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },
  gridColumn: {
    justifyContent: 'space-between',
  },
});

export default ResourceCategoryCarousel;