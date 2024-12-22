import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import Feather from '@expo/vector-icons/Feather';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuizInstructions({ route, navigation }) {
  const { subjects, difficulty, timePerQuestion, numQuestions, possibleCoins } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz Instructions</Text>
          <Image source={DesignUi3} style={styles.headerImage} />
        </View>

        {/* Instructions Content */}
        <View style={styles.content}>
          <Text style={styles.label}>Selected Subjects:</Text>
          <View style={styles.infoContainer}>
            {subjects.map((subject, index) => (
              <Text key={index} style={[styles.infoText, { color: Colors.PRIMARY }]}><Feather name="check-circle" size={16} color={Colors.SECONDARY} style={{ marginRight: 5 }} /> {subject}</Text>
            ))}
          </View>

          <Text style={styles.label}>Quiz Details:</Text>
          <View style={styles.infoContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.infoText}>Total Number of Questions: </Text>
            <Text style={[styles.infoText, { color: Colors.PRIMARY }]}> {numQuestions}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.infoText}>Time per Question:</Text>
            <Text style={[styles.infoText, { color: Colors.PRIMARY }]}>  {timePerQuestion} seconds</Text>
            </View>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <Text style={styles.infoText}>Difficulty Level:</Text>
           <Text style={[styles.infoText, { color: Colors.PRIMARY }]}>  {difficulty}</Text>
           </View>
          
            <View>
            <Text style={styles.infoText}>Possible Coins to be Earned: </Text>
            <Text style={[styles.infoText, { color: Colors.PRIMARY }]}>  {possibleCoins}</Text>
            </View>
           
          </View>

          <Text style={styles.label}>Instructions:</Text>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionItem}>✔ Read each question carefully.</Text>
            <Text style={styles.instructionItem}>✔ Answer all questions to the best of your ability.</Text>
            <Text style={styles.instructionItem}>✔ Manage your time efficiently.</Text>
            <Text style={styles.instructionItem}>✔ Check your answers before submission.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Custom Start Quiz Button */}
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('QuizScreen')}>
        <Text style={styles.startButtonText}>Start Quiz</Text>
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
    color: Colors.SECONDARY,
  },
 
  infoText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginVertical: 5,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionItem: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginVertical: 5,
  },
  startButton: {
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
  startButtonText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.WHITE,
  },
});
