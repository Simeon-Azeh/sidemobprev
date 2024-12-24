import { View, Text, Image, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import TestImg from '../../../assets/Images/OnlineTest.png';
import Colors from '../../../assets/Utils/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Welcome() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    const checkUserResults = async () => {
      setLoading(true);
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        const q = query(collection(db, 'quizResults'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setHasResults(true);
        }
      } catch (error) {
        console.error('Error checking user results:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserResults();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View>
        <Image 
          source={TestImg} 
          style={styles.image} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          {hasResults ? 'Welcome Back! 🎉' : 'Get ready for awesomeness 🎓'}
        </Text>
        <Text style={styles.subtitleText}>
          {hasResults 
            ? 'Continue your journey to ace the GCE Mock exam. Get your scores in real-time. 📊'
            : 'We’ve built a sample of your GCE Mock exam to get you ready any day, any time. Get your scores in real-time. ⏰'
          }
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('QuizChoice')}
        >
          <Text style={styles.buttonText}>
            {hasResults ? 'Continue 🚀' : 'Get Started 🏁'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  textContainer: {
    padding: 20,
    alignItems: 'center',
  },
  titleText: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Colors.WHITE,
  },
});
