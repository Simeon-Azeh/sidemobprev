import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuizChoice({ navigation }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const db = getFirestore();
        const quizzesCollection = collection(db, 'quizzes');
        const quizzesSnapshot = await getDocs(quizzesCollection);
        const subjects = new Set();
        quizzesSnapshot.forEach(doc => {
          const data = doc.data();
          Object.keys(data.subjects).forEach(subject => subjects.add(subject));
        });
        setSubjectsList(Array.from(subjects));
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectSelect = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(sub => sub !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleNext = async () => {
    if (selectedSubjects.length === 0 || !difficulty || !timePerQuestion || !numQuestions) {
      Alert.alert("Incomplete Selection", "Please select all the inputs before proceeding.");
      return;
    }

    const userChoices = {
      subjects: selectedSubjects,
      difficulty,
      timePerQuestion,
      numQuestions,
    };

    try {
      await AsyncStorage.setItem('userChoices', JSON.stringify(userChoices));
      console.log("User choices saved locally");
    } catch (error) {
      console.error("Error saving user choices locally:", error);
    }

    navigation.navigate('QuizInstructions', userChoices);
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_HEADER }]}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BUTTON }]} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colorScheme === 'light' ? '#fff' : Colors.WHITE }]}>Select Your Quiz</Text>
          <Image source={DesignUi3} style={{ width: screenWidth * 0.8, height: screenHeight * 0.4, position: 'absolute', top: 20, left: 0, zIndex: -1, opacity: 0.8 }} />
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : (
            <>
              <Text style={[styles.label, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Select Subjects:</Text>
              <View style={styles.subjectsContainer}>
                {subjectsList.map((subject, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subjectBox,
                      { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY, borderColor: colorScheme === 'light' ? 'transparent' : Colors.DARK_BORDER, borderWidth: colorScheme === 'light' ? 0 : 1 },
                      selectedSubjects.includes(subject) && { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff', borderColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' },
                    ]}
                    onPress={() => handleSubjectSelect(subject)}
                  >
                    <Text style={[
                      styles.subjectText,
                      { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE },
                      selectedSubjects.includes(subject) && { color: colorScheme === 'light' ? '#fff' : '#000' },
                    ]}>{subject}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Select Difficulty Level:</Text>
              <View style={styles.radioContainer}>
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.radioBox,
                      { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY, borderColor: colorScheme === 'light' ? 'transparent' : Colors.DARK_BORDER, borderWidth: colorScheme === 'light' ? 0 : 1 },
                      difficulty === level && { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff', borderColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' },
                    ]}
                    onPress={() => setDifficulty(level)}
                  >
                    <Text style={[
                      styles.radioText,
                      { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE },
                      difficulty === level && { color: colorScheme === 'light' ? '#fff' : '#000' },
                    ]}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Time per Question (in seconds):</Text>
              <View style={styles.radioContainer}>
                {['30', '60', '90'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.radioBox,
                      { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY, borderColor: colorScheme === 'light' ? 'transparent' : Colors.DARK_BORDER, borderWidth: colorScheme === 'light' ? 0 : 1 },
                      timePerQuestion === time && { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff', borderColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' },
                    ]}
                    onPress={() => setTimePerQuestion(time)}
                  >
                    <Text style={[
                      styles.radioText,
                      { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE },
                      timePerQuestion === time && { color: colorScheme === 'light' ? '#fff' : '#000' },
                    ]}>{time} seconds</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Number of Questions:</Text>
              <View style={styles.radioContainer}>
                {['10', '20', '30'].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.radioBox,
                      { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY, borderColor: colorScheme === 'light' ? 'transparent' : Colors.DARK_BORDER, borderWidth: colorScheme === 'light' ? 0 : 1 },
                      numQuestions === num && { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff', borderColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' },
                    ]}
                    onPress={() => setNumQuestions(num)}
                  >
                    <Text style={[
                      styles.radioText,
                      { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE },
                      numQuestions === num && { color: colorScheme === 'light' ? '#fff' : '#000' },
                    ]}>{num} Questions</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.nextButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON }]} onPress={handleNext}>
        <Text style={[styles.nextButtonText, { color: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_TEXT }]}>Next</Text>
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
  content: {
    padding: 20,
  },
  label: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    marginVertical: 10,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectBox: {
    width: '48%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  subjectText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  radioBox: {
    width: '48%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  radioText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
  nextButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
});