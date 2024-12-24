import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import CelebrationImage from '../../../assets/Images/CelebrationImage.png';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PASS_MARK = 0.5; // 50% of the total score

export default function QuizResults({ route }) {
  const navigation = useNavigation();
  const { score, totalQuestions, coinsEarned, totalTime, questions } = route.params;

  const percentageScore = score / totalQuestions;
  const scoreMessage = percentageScore >= PASS_MARK ? "Congratulations!" : "You can do better! Try again";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('QuizChoice')}>
        <Ionicons name="chevron-back" size={32} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Image source={CelebrationImage} style={styles.image} />
        <Text style={styles.scoreMessage}>{scoreMessage}</Text>
        <Text style={styles.scoreText}>You scored {score} out of {totalQuestions}!</Text>
        <Text style={styles.coinsText}>+ <FontAwesome6 name="coins" size={18} color={Colors.PRIMARY} /> {coinsEarned}</Text>
        <Text style={styles.timeText}>Time Taken: {totalTime} seconds</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.correctAnswersButton} onPress={() => navigation.navigate('CorrectAnswers', { questions })}>
            <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>See Correct Answers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.retakeQuizButton} onPress={() => navigation.navigate('QuizScreen')}>
            <Text style={styles.buttonText}>Retake Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    marginBottom: 20,
  },
  scoreMessage: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 20,
  },
  coinsText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 50,
    padding: 5,
    textAlign: 'center',
    alignSelf: 'center',
    width: '20%',
  },
  timeText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  correctAnswersButton: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  retakeQuizButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  buttonText: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
});