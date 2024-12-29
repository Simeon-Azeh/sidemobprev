import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import Feather from '@expo/vector-icons/Feather';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuizInstructions({ route, navigation }) {
  const { subjects, difficulty, timePerQuestion, numQuestions } = route.params;
  const [possibleCoins, setPossibleCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const calculatePossibleCoins = () => {
      const basePoints = 20;
      const additionalPoints = 10;
      const questionsPerSubject = numQuestions / subjects.length;
      const pointsPerSubject = basePoints + Math.floor((questionsPerSubject - 10) / 10) * additionalPoints;
      const totalPoints = pointsPerSubject * subjects.length;
      setPossibleCoins(totalPoints);
    };

    calculatePossibleCoins();
  }, [subjects, numQuestions]);

  const handleStartQuiz = async () => {
    setLoading(true);

    try {
      const db = getFirestore();
      const user = auth.currentUser;
      const quizQuestions = [];

      for (const subject of subjects) {
        const questionsQuery = query(
          collection(db, 'quizzes', 'sampleQuiz', 'subjects', subject, difficulty),
          where('difficulty', '==', difficulty)
        );
        const questionsSnapshot = await getDocs(questionsQuery);
        questionsSnapshot.forEach(doc => {
          quizQuestions.push({ id: doc.id, ...doc.data() });
        });
      }

      // Shuffle and limit the number of questions
      const shuffledQuestions = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestions);

      // Create a quiz session for the user
      const quizSession = {
        userId: user.uid,
        subjects,
        difficulty,
        timePerQuestion,
        numQuestions,
        questions: shuffledQuestions,
        startTime: new Date().toISOString(), // Use ISO string to avoid non-serializable values
      };

      // Save the quiz session to Firestore
      await setDoc(doc(db, 'quizSessions', user.uid), quizSession);

      navigation.navigate('QuizScreen', { quizSession });
    } catch (error) {
      console.error("Error starting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Back Button */}
        <View style={[styles.header, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_HEADER }]}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BUTTON }]} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colorScheme === 'light' ? '#fff' : Colors.WHITE }]}>Quiz Instructions</Text>
          <Image source={DesignUi3} style={styles.headerImage} />
        </View>

        {/* Instructions Content */}
        <View style={styles.content}>
          <Text style={[styles.label, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Selected Subjects:</Text>
          <View style={styles.infoContainer}>
            {subjects.map((subject, index) => (
              <Text key={index} style={[styles.infoText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>
                <Feather name="check-circle" size={16} color={Colors.SECONDARY} style={{ marginRight: 10 }} /> {subject}
              </Text>
            ))}
          </View>

          <Text style={[styles.label, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Quiz Details:</Text>
          <View style={styles.infoContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Total Number of Questions: </Text>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.LIGHT_TEXT }]}> {numQuestions}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Time per Question:</Text>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.LIGHT_TEXT }]}>  {timePerQuestion} seconds</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Difficulty Level:</Text>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.LIGHT_TEXT }]}>  {difficulty}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Possible Coins to be Earned: </Text>
              <Text style={[styles.infoText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.LIGHT_TEXT }]}>  {possibleCoins}</Text>
            </View>
          </View>

          <Text style={[styles.label, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Instructions:</Text>
          <View style={styles.instructionsContainer}>
            <Text style={[styles.instructionItem, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>✔ Read each question carefully.</Text>
            <Text style={[styles.instructionItem, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>✔ Answer all questions to the best of your ability.</Text>
            <Text style={[styles.instructionItem, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>✔ Manage your time efficiently.</Text>
            <Text style={[styles.instructionItem, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>✔ Check your answers before submission.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Custom Start Quiz Button */}
      <TouchableOpacity style={[styles.startButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON }]} onPress={handleStartQuiz} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.WHITE} />
        ) : (
          <Text style={[styles.startButtonText, { color: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_TEXT }]}>Start Quiz</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: screenHeight * 0.1, // Add space for the fixed button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    height: screenHeight * 0.35, // Keep header height
    width: '100%', // Full width header
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 80,
    zIndex: 1,
    borderRadius: 50,
    padding: 5,
  },
  headerTitle: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    flex: 1,
  },
  headerImage: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    position: 'absolute',
    top: 20,
    left: 0,
    zIndex: -1,
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    marginVertical: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    marginVertical: 5,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionItem: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    marginVertical: 5,
  },
  startButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
});