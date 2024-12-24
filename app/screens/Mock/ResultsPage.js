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
  const { score, totalQuestions, coinsEarned, totalTime } = route.params;

  const percentageScore = score / totalQuestions;
  const scoreMessage = percentageScore >= PASS_MARK ? "Congratulations!" : "You can do better! Try again";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('QuizChoice')}>
        <Ionicons name="chevron-back" size={32} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Image source={CelebrationImage} style={styles.image} resizeMode="contain" />
        <Text style={styles.scoreMessage}>{scoreMessage}</Text>
        <Text style={styles.scoreText}>You scored {score} out of {totalQuestions}!</Text>
        <View style={styles.coinsContainer}>
          <FontAwesome6 name="coins" size={18} color={Colors.PRIMARY} />
          <Text style={styles.coinsText}>+ {coinsEarned}</Text>
        </View>
        <Text style={styles.timeText}>Time Taken: {totalTime} seconds</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.correctAnswersButton} onPress={() => navigation.navigate('CorrectAnswers', { score, totalQuestions })}>
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
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.35,
    marginBottom: 20,
  },
  scoreMessage: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Poppins-Bold',
    color: Colors.PRIMARY,
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coinsText: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginLeft: 5,
  },
  timeText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  correctAnswersButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retakeQuizButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    textAlign: 'center',
  },
});
