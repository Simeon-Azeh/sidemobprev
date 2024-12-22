import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from 'react-native-progress/Bar';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuizScreen() {
    const navigation = useNavigation();

    // State for user answers
    const [selectedOption, setSelectedOption] = useState('');
    const [textAnswer, setTextAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        java: false,
        python: false,
        javascript: false,
        html: false,
    });

    // Handle option selection
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    // Handle checkbox selection
    const handleCheckboxChange = (key) => {
        setSelectedOptions(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Calculate score based on answers
    const calculateScore = () => {
        let score = 0;

        // Question 1: MCQ
        if (selectedOption === 'Paris') {
            score += 1;
        }

        // Question 2: Text Answer (Simplified scoring example)
        if (textAnswer.toLowerCase().includes('relativity')) { // Check for a keyword in the answer
            score += 1;
        }

        // Question 3: Checkboxes
        const correctOptions = {
            java: true,
            python: true,
            javascript: true,
            html: false,
        };

        let allCorrect = true;
        for (let key in correctOptions) {
            if (selectedOptions[key] !== correctOptions[key]) {
                allCorrect = false;
                break;
            }
        }
        if (allCorrect) {
            score += 1;
        }

        return score;
    };

    // Handle submit and navigate to results
    const handleSubmit = () => {
        const score = calculateScore(); // Ensure calculateScore is defined above this
        const totalQuestions = 3; // Example total questions
        const coinsEarned = score * 10; // Example logic for coins earned
        const totalTime = '10:00'; // Example time taken

        navigation.navigate('QuizResults', {
            score,
            totalQuestions,
            coinsEarned,
            totalTime,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <ProgressBar progress={0.5} width={null} color={Colors.WHITE} />
                    <View style={styles.timeContainer}>
                        <Ionicons name="timer" size={24} color={Colors.WHITE} />
                        <Text style={styles.timeText}>10:00 mins</Text>
                    </View>
                </View>
                <Image source={DesignUi3} style={styles.headerImage} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={{ flex: 1, padding: 20 }}>
                    {/* Question 1: MCQ */}
                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>1. What is the capital of France?</Text>
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                selectedOption === 'Paris' && styles.selectedOptionButton
                            ]}
                            onPress={() => handleOptionSelect('Paris')}
                        >
                            <Text style={[styles.optionText, selectedOption === 'Paris' && styles.selectedOptionText]}>Paris</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                selectedOption === 'London' && styles.selectedOptionButton
                            ]}
                            onPress={() => handleOptionSelect('London')}
                        >
                            <Text style={[styles.optionText, selectedOption === 'London' && styles.selectedOptionText]}>London</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                selectedOption === 'Berlin' && styles.selectedOptionButton
                            ]}
                            onPress={() => handleOptionSelect('Berlin')}
                        >
                            <Text style={[styles.optionText, selectedOption === 'Berlin' && styles.selectedOptionText]}>Berlin</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Question 2: Text Input */}
                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>2. Explain the theory of relativity in brief.</Text>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            numberOfLines={4}
                            value={textAnswer}
                            onChangeText={setTextAnswer}
                            placeholder="Type your answer here..."
                        />
                    </View>

                    {/* Question 3: Checkboxes */}
                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>3. Which of the following are programming languages?</Text>
                        <CustomCheckbox
                            label="Java"
                            checked={selectedOptions.java}
                            onChange={() => handleCheckboxChange('java')}
                        />
                        <CustomCheckbox
                            label="Python"
                            checked={selectedOptions.python}
                            onChange={() => handleCheckboxChange('python')}
                        />
                        <CustomCheckbox
                            label="JavaScript"
                            checked={selectedOptions.javascript}
                            onChange={() => handleCheckboxChange('javascript')}
                        />
                        <CustomCheckbox
                            label="HTML"
                            checked={selectedOptions.html}
                            onChange={() => handleCheckboxChange('html')}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveDraftButton} onPress={() => console.log('Save Draft clicked')}>
                    <Text style={styles.buttonTextprimary}>Save Draft</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonTextsecondary}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Custom Checkbox Component
const CustomCheckbox = ({ label, checked, onChange }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onChange}>
        <View style={[styles.checkbox, checked && styles.checked]}>
            {checked && <Ionicons name="checkmark" size={16} color={Colors.WHITE} />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: screenHeight * 0.1, // Add space for the fixed buttons
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 20,
    height: screenHeight * 0.35, // Header height
    width: '100%', // Full width header
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    zIndex: 1,
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
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '50%',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  timeText: {
    fontSize: screenWidth * 0.04,
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
    color: Colors.WHITE,
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOptionButton: {
    backgroundColor: Colors.PRIMARY,
  },
  optionText: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  selectedOptionText: {
    color: '#fff',
  },
  textInput: {
    height: screenHeight * 0.1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.03,
    color: Colors.SECONDARY,
    paddingTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: Colors.PRIMARY,
  },
  checkboxLabel: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
  },
      // Save Draft Button
      saveDraftButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        borderWidth: 1,
        borderColor: Colors.PRIMARY,

    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
    },
    buttonTextprimary: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
    },
    buttonTextsecondary: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
        color: Colors.WHITE,
    },
});