import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Linking, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width: width } = Dimensions.get('window');

const VideoCard = ({ title, description, thumbnail, videoUrl, year, level, duration }) => {
  const colorScheme = useColorScheme();
  const animatedValue = new Animated.Value(1);

  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(videoUrl);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert("Error", "Cannot open this video URL");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while opening the video");
    }
  };

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          { 
            backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY,
            shadowColor: colorScheme === 'light' ? '#ccc' : '#000',
          }
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          <View style={styles.playButton}>
            <MaterialIcons name="play-circle-filled" size={40} color="white" />
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text 
            style={[
              styles.title, 
              { color: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }
            ]} 
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text 
            style={[
              styles.description, 
              { color: colorScheme === 'light' ? Colors.MUTED : Colors.DARK_TEXT_MUTED }
            ]} 
            numberOfLines={2}
          >
            {description}
          </Text>
          <View style={styles.metaContainer}>
            <Text 
              style={[
                styles.meta, 
                { color: colorScheme === 'light' ? Colors.MUTED : Colors.DARK_TEXT_MUTED }
              ]}
            >
              {level} • {year}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    width: (width - 30) / 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 120,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  durationContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Poppins',
    lineHeight: 16,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
});

export default VideoCard;