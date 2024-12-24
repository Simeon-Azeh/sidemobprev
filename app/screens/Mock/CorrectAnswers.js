import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CorrectAnswersScreen({ route }) {
    const navigation = useNavigation();
    const { questions } = route.params;

    if (!questions) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No questions available.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={Colors.PRIMARY} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Correct Answers</Text>
                <Image source={DesignUi3} style={styles.headerImage} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={{ flex: 1, padding: 20 }}>
                    {questions.map((item, index) => (
                        <View key={index} style={styles.questionContainer}>
                            <Text style={styles.question}>{index + 1}. {item.question}</Text>
                            <Text style={styles.correctAnswerTitle}>Correct Answer:</Text>
                            <Text style={styles.correctAnswer}>{item.answer}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('QuizScreen')}>
                    <Text style={styles.buttonTextsecondary}>Retake Quiz</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: screenHeight * 0.1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: 20,
        paddingTop: 20,
        height: screenHeight * 0.2,
        width: '100%',
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
    questionContainer: {
        marginBottom: 20,
    },
    question: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
        color: Colors.SECONDARY,
        marginBottom: 10,
    },
    correctAnswerTitle: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
        marginBottom: 5,
    },
    correctAnswer: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins',
        color: Colors.SECONDARY,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
    },
    buttonTextsecondary: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
        color: Colors.WHITE,
    },
    errorText: {
        fontSize: screenWidth * 0.05,
        fontFamily: 'Poppins-Medium',
        color: Colors.SECONDARY,
        textAlign: 'center',
        marginTop: 20,
    },
});