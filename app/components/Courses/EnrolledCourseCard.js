import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';  // Progress bar package
import Colors from '../../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const EnrolledCourseCard = ({ courseId, imageUri, courseTitle, courseCategory, hostImageUri, hostName, progress }) => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme(); // Get the current color scheme

    const handleContinueCourse = () => {
        navigation.navigate('CourseMaterial', { courseId, courseTitle });
    };

    return (
        <View style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
            {/* Course Image */}
            <Image source={{ uri: imageUri }} style={styles.courseImage} />

            {/* Course Title and Category */}
            <Text style={[styles.courseTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>{courseTitle}</Text>
            <Text style={[styles.courseCategory, { color: colorScheme === 'light' ? '#777' : '#ccc' }]}>{courseCategory}</Text>

            {/* Host Information */}
            <View style={styles.hostRow}>
                <Image source={{ uri: hostImageUri }} style={styles.hostImage} />
                <Text style={[styles.hostName, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}> {hostName}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressRow}>
                <Progress.Bar 
                    progress={progress} 
                    width={screenWidth * 0.8} 
                    height={8} 
                    color={Colors.PRIMARY} 
                    unfilledColor={colorScheme === 'light' ? '#e0e0e0' : '#444'} 
                    borderWidth={0}
                    style={styles.progressBar} 
                />
                <Text style={[styles.progressText, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>{`${Math.round(progress * 100)}%`}</Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity 
                style={[
                    styles.continueButton, 
                    { 
                        backgroundColor: colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BUTTON, 
                        borderColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BORDER 
                    }
                ]} 
                onPress={handleContinueCourse}
            >
                <Text style={[styles.continueButtonText, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>
                    {progress === 0 ? 'Start Course' : 'Continue Course'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    courseImage: {
        width: '100%',
        height: screenWidth * 0.25,
        borderRadius: 10,
        marginBottom: 15,
    },
    courseTitle: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
    },
    courseCategory: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins',
        marginBottom: 15,
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    hostImage: {
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        borderRadius: 50,
        marginRight: 10,
    },
    hostName: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    progressBar: {
        flex: 1,
        marginRight: 10,
    },
    progressText: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
    },
    continueButton: {
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
    },
    continueButtonText: {
        fontFamily: 'Poppins-Medium',
        fontSize: screenWidth * 0.03,
    },
});

export default EnrolledCourseCard;