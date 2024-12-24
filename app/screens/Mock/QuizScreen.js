import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuizScreen() {
    const navigation = useNavigation();
    const timerRef = useRef(null);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            // Reset state when the screen gains focus
            setQuestions([]);
            setLoading(true);
            setSubmitting(false);
            setSelectedAnswers({});
            setCurrentQuestionIndex(0);
            setTotalTime(0);
            setTimeLeft(0);

            fetchUserChoices();

            // Start the timer
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime > 0) {
                        if (prevTime === 10) {
                            Alert.alert("Warning", "Only 10 seconds left!");
                        }
                        return prevTime - 1;
                    } else {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                });
            }, 1000);

            return () => {
                clearInterval(timerRef.current);
            };
        }, [])
    );

    const fetchUserChoices = async () => {
        try {
            const userChoices = await AsyncStorage.getItem('userChoices');
            if (userChoices) {
                const { subjects, difficulty, timePerQuestion, numQuestions } = JSON.parse(userChoices);
                const totalQuizTime = parseInt(timePerQuestion, 10) * parseInt(numQuestions, 10);
                setTotalTime(totalQuizTime);
                setTimeLeft(totalQuizTime);
                fetchQuestions(subjects, difficulty, numQuestions);
            } else {
                console.error('No user choices found in local storage');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user choices from local storage:', error);
            setLoading(false);
        }
    };

    const fetchQuestions = async (subjects, difficulty, numQuestions) => {
        setLoading(true);
        try {
            const db = getFirestore();
            let fetchedQuestions = [];

            for (const subject of subjects) {
                console.log(`Fetching questions for subject: ${subject}, difficulty: ${difficulty}`);
                const subjectDoc = await getDocs(collection(db, 'quizzes'));

                subjectDoc.forEach(doc => {
                    const subjectData = doc.data();
                    console.log(`Document data for subject ${subject}:`, subjectData);
                    if (subjectData.subjects && subjectData.subjects[subject] && subjectData.subjects[subject][difficulty]) {
                        const questionsList = subjectData.subjects[subject][difficulty];
                        if (Array.isArray(questionsList)) {
                            questionsList.forEach(question => {
                                if (question.question && question.options && question.answer) {
                                    fetchedQuestions.push({
                                        id: `${subject}_${fetchedQuestions.length}`,
                                        ...question
                                    });
                                }
                            });
                        }
                    }
                });
            }

            console.log('Fetched Questions:', fetchedQuestions);

            if (fetchedQuestions.length > 0) {
                const shuffledQuestions = fetchedQuestions
                    .sort(() => 0.5 - Math.random())
                    .slice(0, parseInt(numQuestions, 10));
                setQuestions(shuffledQuestions);
            } else {
                console.error('No questions found for the selected criteria');
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleTextAnswerChange = (questionId, text) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: text,
        }));
    };

    const handleCheckboxChange = (questionId, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [option]: !prev[questionId]?.[option],
            },
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        let score = 0;

        questions.forEach(question => {
            const userAnswer = selectedAnswers[question.id];
            if (question.type === 'MCQs' && userAnswer === question.answer) {
                score += 1;
            } else if (question.type === 'Text' && userAnswer?.toLowerCase() === question.answer.toLowerCase()) {
                score += 1;
            } else if (question.type === 'MultipleAnswers') {
                const correctOptions = question.answer;
                let allCorrect = true;
                for (let key in correctOptions) {
                    if (userAnswer?.[key] !== correctOptions[key]) {
                        allCorrect = false;
                        break;
                    }
                }
                if (allCorrect) {
                    score += 1;
                }
            }
        });

        const totalQuestions = questions.length;
        const coinsEarned = score * 10; // Coins earned based on the score
        const timeSpent = totalTime - timeLeft; // Calculate the time spent

        const db = getFirestore();
        const userChoices = await AsyncStorage.getItem('userChoices');
        const { subjects, difficulty } = JSON.parse(userChoices);
        const auth = getAuth();
        const user = auth.currentUser;

        try {
            await addDoc(collection(db, 'quizResults'), {
                userId: user.uid,
                score: score, // Use the raw score without penalties
                totalQuestions,
                coinsEarned,
                totalTime: timeSpent, // Save the time spent
                subjects,
                difficulty,
                timestamp: new Date(),
            });
            console.log("Quiz results saved to Firestore");
        } catch (error) {
            console.error("Error saving quiz results to Firestore:", error);
        }

        navigation.navigate('QuizResults', {
            score: score, // Pass the raw score to the results page
            totalQuestions,
            coinsEarned,
            totalTime: timeSpent, // Pass the time spent to the results page
        });

        setSubmitting(false);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No questions available for the selected criteria.</Text>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = timeLeft % 60;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
                    <Text style={[{ color: Colors.PRIMARY, fontFamily: 'Poppins-Medium', fontSize: 14 }]}>
                    End Quiz
                </Text>
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                
                        <View style={styles.timeContainer}>
                <MaterialCommunityIcons name="timer-outline" size={32} color={timeLeft === 0 ? 'red' : Colors.WHITE} />
                <Text style={[styles.timeText, { color: timeLeft === 0 ? 'red' : Colors.WHITE }]}>
                    Time left:
                </Text>
                <Text style={[styles.timeText, { color: timeLeft === 0 ? 'red' : Colors.WHITE }]}>
                    {minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                </Text>
            </View>


                </View>
                <Image source={DesignUi3} style={styles.headerImage} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={{ flex: 1, padding: 20 }}>
                    <View style={styles.questionContainer}>
                    <Text style={[styles.question, { fontSize: 14, color: Colors.PRIMARY }]}>
                     Question {currentQuestionIndex + 1} / {questions.length}
                  </Text>

                        <Text style={styles.question}>
                           {currentQuestion.question}
                        </Text>
                        {currentQuestion.type === 'MCQs' && currentQuestion.options.map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.optionButton,
                                    selectedAnswers[currentQuestion.id] === option && styles.selectedOptionButton
                                ]}
                                onPress={() => handleOptionSelect(currentQuestion.id, option)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedAnswers[currentQuestion.id] === option && styles.selectedOptionText
                                ]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        {currentQuestion.type === 'Text' && (
                            <TextInput
                                style={styles.textInput}
                                multiline
                                numberOfLines={4}
                                value={selectedAnswers[currentQuestion.id] || ''}
                                onChangeText={text => handleTextAnswerChange(currentQuestion.id, text)}
                                placeholder="Type your answer here..."
                            />
                        )}
                        {currentQuestion.type === 'MultipleAnswers' && currentQuestion.options.map(option => (
                            <CustomCheckbox
                                key={option}
                                label={option}
                                checked={selectedAnswers[currentQuestion.id]?.[option] || false}
                                onChange={() => handleCheckboxChange(currentQuestion.id, option)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleNextQuestion} disabled={submitting}>
                    {submitting ? (
                        <ActivityIndicator size="small" color={Colors.WHITE} />
                    ) : (
                        <Text style={styles.buttonTextsecondary}>{currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}</Text>
                    )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: 20,
        paddingTop: 20,
        height: screenHeight * 0.2,
        width: '100%',
        borderBottomLeftRadius: 0,
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
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    progressContainer: {
        flex: 1,
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'end',
        alignSelf: 'flex-end', // This moves it to the right
    },    
    timeText: {
        marginLeft: 5,
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
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
    scrollContainer: {
        paddingBottom: screenHeight * 0.1,
    },
    questionContainer: {
        marginBottom: 20,
        marginTop: 40,
    },
    question: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        color: Colors.SECONDARY,
        marginBottom: 10,
    },
    optionButton: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedOptionButton: {
        backgroundColor: Colors.PRIMARY,
        borderColor: Colors.PRIMARY,

    },
    optionText: {
        fontSize: 16,
        color: Colors.SECONDARY,
        fontFamily: 'Poppins-Medium',

    },
    selectedOptionText: {
        color: Colors.WHITE,
    },
    textInput: {
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        fontSize: 16,
        color: Colors.SECONDARY,
        paddingTop: 10,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    buttonTextsecondary: {
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
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
        fontSize: 16,
    },
});