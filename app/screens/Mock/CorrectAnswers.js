import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DesignUi3 from '../../../assets/Images/DesignUi3.png';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CorrectAnswersScreen({ route }) {
    const navigation = useNavigation();
    const { questions } = route.params;
    const colorScheme = useColorScheme();

    if (!questions) {
        return (
            <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
                <Text style={[styles.errorText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>No questions available.</Text>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BUTTON }]} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
            <View style={[styles.header, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_HEADER }]}>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BUTTON }]} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_TEXT }]}>Correct Answers</Text>
                <Image source={DesignUi3} style={styles.headerImage} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={{ flex: 1, padding: 20 }}>
                    {questions.map((item, index) => (
                        <View key={index} style={styles.questionContainer}>
                            <Text style={[styles.question, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>{index + 1}. {item.question}</Text>
                            <Text style={[styles.correctAnswerTitle, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_TEXT }]}>Correct Answer:</Text>
                            <Text style={[styles.correctAnswer, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>{item.answer}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={[styles.buttonContainer, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON }]} onPress={() => navigation.navigate('QuizScreen')}>
                    <Text style={[styles.buttonTextsecondary, { color: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_TEXT }]}>Retake Quiz</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: screenHeight * 0.1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
        borderRadius: 50,
        padding: 5,
        zIndex: 1,
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
    questionContainer: {
        marginBottom: 20,
    },
    question: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
    },
    correctAnswerTitle: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        marginBottom: 5,
    },
    correctAnswer: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Poppins-Bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
    },
    submitButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
    },
    buttonTextsecondary: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
    },
    errorText: {
        fontSize: screenWidth * 0.05,
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        marginTop: 20,
    },
});