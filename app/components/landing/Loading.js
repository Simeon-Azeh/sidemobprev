import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/Utils/Colors';
import logo from '../../../assets/Images/SidecLogo.png'; // Replace with your logo path

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoadingScreen = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    // Animate the progress bar
    Animated.timing(progress, {
      toValue: 100,
      duration: 4000, // 4 seconds for the loader
      useNativeDriver: false,
    }).start(() => {
      // Once the loading is done, navigate to the WelcomeScreen
      navigation.replace('Welcome');
    });
  }, [navigation]);

  const progressInterpolation = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressInterpolation }]}
          />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE, // Set the background to white
    justifyContent: 'space-between', // Distribute space between elements
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: screenWidth * 0.3,
    height: screenHeight * 0.1,
    resizeMode: 'contain',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.1, // Move the progress bar and text closer to the bottom
  },
  progressBarBackground: {
    height: 5, // Smaller height for the progress bar
    width: '50%', // Make the progress bar smaller
    backgroundColor: '#E0E0E0', // Light gray background for contrast
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: screenHeight * 0.02, // Space between progress bar and "Loading" text
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY, // Dark fill color for contrast
  },
  loadingText: {
    fontSize: screenWidth * 0.03, // Smaller font size
    color: Colors.SECONDARY, // Match the text color with the progress bar fill
    fontFamily: 'Poppins-Medium',
  },
});

export default LoadingScreen;
