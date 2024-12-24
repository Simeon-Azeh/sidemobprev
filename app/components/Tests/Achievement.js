import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share , Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../assets/Utils/Colors'; // Adjust the path if needed

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const Achievement = () => {
  // Sample data for achievements
  const lastScore = 85;
  const totalQuestions = 20;
  const correctAnswers = 15;
  const wrongAnswers = 5;
  const lastBadge = require('../../../assets/Images/award_one.jpg'); // Adjust the path if needed
  const betterThanPercent = 75; // Example: User performed better than 75% of users

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

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreTitle}>Congratulations! You scored</Text>
        <Text style={styles.score}>{lastScore}</Text>
        <Text style={styles.scoreTitle}>on your last attempt</Text>
        <Text style={styles.encouragingText}>
          You performed better than {betterThanPercent}% of users. Keep up the great work!
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="question-circle" size={20} color='gray' />
          <Text style={styles.statText}>Questions: {totalQuestions}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="check-circle" size={20} color={Colors.PRIMARY} />
          <Text style={styles.statText}>Correct: {correctAnswers}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="times-circle" size={20} color="#ff0000" />
          <Text style={styles.statText}>Wrong: {wrongAnswers}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
        <Text style={styles.shareText}>Share Achievement</Text>
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
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
    marginVertical: 5,
  },
  score: {
    fontSize: screenWidth * 0.08,
    fontFamily: 'Poppins-Bold',
    color: Colors.PRIMARY,
    backgroundColor: '#eaf4fc',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginVertical: 10,
    textAlign: 'center',
    width: screenWidth * 0.4,
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
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  badgeImage: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.125,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  shareButton: {
    marginTop: 20,
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
});

export default Achievement;
