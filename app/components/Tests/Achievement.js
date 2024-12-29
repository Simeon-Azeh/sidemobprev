import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useColorScheme } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  

const Achievement = () => {
  const [loading, setLoading] = useState(true);
  const [lastScore, setLastScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [betterThanPercent, setBetterThanPercent] = useState(0);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchLatestResult = async () => {
      setLoading(true);
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        const q = query(collection(db, 'quizResults'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          let latestResult = null;
          querySnapshot.forEach(doc => {
            const docData = doc.data();
            if (!latestResult || docData.timestamp.toDate() > latestResult.timestamp.toDate()) {
              latestResult = docData;
            }
          });
          if (latestResult) {
            setLastScore(latestResult.score);
            setTotalQuestions(latestResult.totalQuestions);
            setCorrectAnswers(latestResult.score); // Assuming score is the number of correct answers
            setWrongAnswers(latestResult.totalQuestions - latestResult.score);
            // Calculate betterThanPercent (example logic, adjust as needed)
            setBetterThanPercent(Math.floor((latestResult.score / latestResult.totalQuestions) * 100));
          }
        }
      } catch (error) {
        console.error('Error fetching latest result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out my latest achievement on Sidec! 
        \nLast Score: ${lastScore} 
        \nQuestions Sat: ${totalQuestions} 
        \nCorrect Answers: ${correctAnswers} 
        \nJoin Sidec today at https://www.sidecedu.com`,
        title: 'My Achievement on Sidec',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
              <ActivityIndicator size="large" color="#9835ff" />
            </View>
    );
  }

  if (lastScore === null) {
    return (
       <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
        <Icon name="info-circle" size={42} color={Colors.SECONDARY} style={styles.icon} />
        <Text style={styles.noDataText}>No achievement data available.</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === 'light'
              ? Colors.LIGHT_BACKGROUND
              : Colors.DARK_BACKGROUND,
        },
      ]}
    >
     
     <Text style={[styles.title, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>
  Your last performance
</Text>
      <View style={[styles.statsContainer, { borderColor: colorScheme === 'light' ? '#e0e0e0' : Colors.DARK_BORDER, backgroundColor: colorScheme === 'light' ? '#f8f8f8' : Colors.DARK_SECONDARY }]}>
        <View style={styles.statItem}>
          <Icon name="question-circle" size={20} color="gray" />
          <Text style={[styles.statText,{ color: colorScheme === 'light' ? '#444' : Colors.DARK_TEXT} ]}>Questions: </Text>
          <Text style={[styles.statTitle, {color: colorScheme === 'light' ? '#9835ff' : Colors.DARK_TEXT}]}> {totalQuestions}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="check-circle" size={20} color={Colors.PRIMARY} />
          <Text style={[styles.statText,{ color: colorScheme === 'light' ? '#444' : Colors.DARK_TEXT} ]}>Correct: </Text>
          <Text style={[styles.statTitle, {color: colorScheme === 'light' ? '#9835ff' : Colors.DARK_TEXT}]}> {correctAnswers}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="times-circle" size={20} color="#ff0000" />
          <Text style={[styles.statText,{ color: colorScheme === 'light' ? '#444' : Colors.DARK_TEXT} ]}>Wrong: </Text>
          <Text style={[styles.statTitle, {color: colorScheme === 'light' ? '#ff0000' : Colors.DARK_TEXT}]}> {wrongAnswers}</Text>
        </View>
      </View>

      <TouchableOpacity 
  style={[
    styles.shareButton, 
    { 
      backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON, 
      borderColor: colorScheme === 'light' ? 'transparent' : Colors.DARK_BORDER, 
      borderWidth: colorScheme === 'light' ? 0 : 1 
    }
  ]} 
  onPress={onShare}
>
  <Text
    style={[
      styles.shareText,
      { color: colorScheme === 'light' ? '#fff' : Colors.DARK_TEXT },
    ]}
  >
    Share Achievement
  </Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },

  encouragingText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
    textAlign: 'center',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: screenWidth * 0.035,
    marginTop: 8,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  shareButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  shareText: {
    color: '#ffffff',
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
  },
  icon: {
    marginBottom: 20,
  },
  noDataText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
  statTitle : {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  title: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
});

export default Achievement;