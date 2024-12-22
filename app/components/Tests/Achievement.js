// components/Achievement.js

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

      <View style={styles.badgeContainer}>
        <Text style={styles.badgeTitle}>Last Badge Won</Text>
        <Image source={lastBadge} style={styles.badgeImage} />
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
   
    borderRadius: 10,
    marginVertical: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  score: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.3,
  },
  statsContainer: {
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statText: {
    fontSize: screenWidth * 0.03,
    marginLeft: 10,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
  badgeContainer: {
    alignItems: 'center',
  },
  badgeTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  badgeImage: {
    width: 100,
    height: 100,
  },
  shareButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Achievement;
