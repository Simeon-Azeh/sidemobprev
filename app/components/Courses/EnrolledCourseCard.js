import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';  // Progress bar package
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

const EnrolledCourseCard = ({ courseId, imageUri, courseTitle, courseCategory, hostImageUri, hostName, progress }) => {
    const navigation = useNavigation();

    const handleContinueCourse = () => {
        navigation.navigate('CourseMaterial', { courseId, courseTitle });
    };

    return (
        <View style={styles.card}>
            {/* Course Image */}
            <Image source={{ uri: imageUri }} style={styles.courseImage} />

            {/* Course Title and Category */}
            <Text style={styles.courseTitle}>{courseTitle}</Text>
            <Text style={styles.courseCategory}>{courseCategory}</Text>

            {/* Host Information */}
            <View style={styles.hostRow}>
                <Image source={{ uri: hostImageUri }} style={styles.hostImage} />
                <Text style={styles.hostName}> {hostName}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressRow}>
                <Progress.Bar 
                    progress={progress} 
                    width={screenWidth * 0.8} 
                    height={8} 
                    color={Colors.PRIMARY} 
                    unfilledColor="#e0e0e0" 
                    borderWidth={0}
                    style={styles.progressBar} 
                />
                <Text style={styles.progressText}>{`${Math.round(progress * 100)}%`}</Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.continueButton} onPress={handleContinueCourse}>
                <Text style={styles.continueButtonText}>{progress === 0 ? 'Start Course' : 'Continue Course'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
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
        color: Colors.SECONDARY,
    },
    courseCategory: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins',
        color: '#777',
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
        color: Colors.SECONDARY,
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
        color: Colors.SECONDARY,
    },
    continueButton: {
        backgroundColor: Colors.WHITE,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
    },
    continueButtonText: {
        color: '#9835FF',
        fontFamily: 'Poppins-Medium',
        fontSize: screenWidth * 0.03,
    },
});

export default EnrolledCourseCard;