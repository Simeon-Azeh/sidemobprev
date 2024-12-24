import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuizChoice({ navigation }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Your Quiz</Text>
          <Image source={DesignUi3} style={{ width: screenWidth * 0.8, height: screenHeight * 0.4, position: 'absolute', top: 20, left: 0, zIndex: -1, opacity: 0.8 }} />
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : (
            <>
              <Text style={styles.label}>Select Subjects:</Text>
              <View style={styles.subjectsContainer}>
                {subjectsList.map((subject, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subjectBox,
                      selectedSubjects.includes(subject) && styles.selectedSubjectBox,
                    ]}
                    onPress={() => handleSubjectSelect(subject)}
                  >
                    <Text style={[styles.subjectText, selectedSubjects.includes(subject) && styles.selectedSubjectText]}>{subject}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Select Difficulty Level:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={difficulty}
                  onValueChange={(itemValue) => setDifficulty(itemValue)}
                >
                  <Picker.Item label="Select Difficulty" value="" />
                  <Picker.Item label="Easy" value="Easy" />
                  <Picker.Item label="Medium" value="Medium" />
                  <Picker.Item label="Hard" value="Hard" />
                </Picker>
              </View>

              <Text style={styles.label}>Time per Question (in seconds):</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={timePerQuestion}
                  onValueChange={(itemValue) => setTimePerQuestion(itemValue)}
                >
                  <Picker.Item label="Select Time" value="" />
                  <Picker.Item label="30 seconds" value="30" />
                  <Picker.Item label="60 seconds" value="60" />
                  <Picker.Item label="90 seconds" value="90" />
                </Picker>
              </View>

              <Text style={styles.label}>Number of Questions:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={numQuestions}
                  onValueChange={(itemValue) => setNumQuestions(itemValue)}
                >
                  <Picker.Item label="Select Number of Questions" value="" />
                  <Picker.Item label="10 Questions" value="10" />
                  <Picker.Item label="20 Questions" value="20" />
                  <Picker.Item label="30 Questions" value="30" />
                </Picker>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: screenHeight * 0.1, // Add space for the fixed button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
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
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
  headerTitle: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
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
    color: Colors.SECONDARY,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedSubjectBox: {
    backgroundColor: Colors.PRIMARY,
  },
  subjectText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  selectedSubjectText: {
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 10,
  },
  nextButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.WHITE,
  },
});