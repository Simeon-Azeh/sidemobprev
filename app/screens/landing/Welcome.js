import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import welcome1 from '../../../assets/Images/Welcome1.png';
import welcome2 from '../../../assets/Images/Welcome2.png';
import welcome3 from '../../../assets/Images/Welcome3.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const WelcomeScreen = () => {
  const swiperRef = useRef(null);
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Register');
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        showsButtons={false}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
      >
        <View style={styles.slideContainer}>
          <Image source={welcome1} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to Sidec!</Text>
            <Text style={styles.subtitle}>
              We help you find the perfect resources to help you practice for your national exams.
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Icon name="arrow-forward" size={15} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.slideContainer}>
          <Image source={welcome2} style={styles.image} />
          <View style={[styles.textContainer, styles.secondaryContainer]}>
            <Text style={[styles.title, { color: Colors.SECONDARY }]}>Learn Anytime, Anywhere</Text>
            <Text style={[styles.subtitle, { color: Colors.SECONDARY }]}>
              Access a wide variety of courses at your convenience.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>Next</Text>
              <Icon name="arrow-forward" size={15} color={Colors.WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.slideContainer}>
          <Image source={welcome3} style={styles.image} />
          <View style={[styles.textContainer, styles.fullHeightContainer]}>
            <Text style={styles.title}>Track Your Progress</Text>
            <Text style={styles.subtitle}>
              Stay on top of your learning journey with our progress tracking features.
            </Text>
            <TouchableOpacity style={styles.nextButton}  onPress={handleGetStarted}>
              <Text style={styles.nextButtonText}>Get Started</Text>
              <Icon name="arrow-forward" size={15} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    resizeMode: 'contain',
  },
  textContainer: {
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center', // Center the content vertically
  },
  secondaryContainer: {
    backgroundColor: Colors.WHITE,
  },
  fullHeightContainer: {
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center', // Center content vertically for the last slide
  },
  title: {
    fontSize: screenWidth * 0.06,
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
    marginBottom: 10, // Add some space between the title and subtitle
  },
  subtitle: {
    fontSize: screenWidth * 0.03,
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30, // Reduce the spacing to balance content
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
    width: '40%',
  },
  nextButtonText: {
    color: Colors.PRIMARY,
    fontSize: 15,
    marginRight: 5,
    fontFamily: 'Poppins-Medium',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, // Reduce the spacing to balance content
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  primaryButtonText: {
    color: Colors.WHITE,
    fontSize: 15,
    marginRight: 5,
    fontFamily: 'Poppins-Medium',
  },
  dot: {
    backgroundColor: '#D9D9D9',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: Colors.PRIMARY,
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});

export default WelcomeScreen;
