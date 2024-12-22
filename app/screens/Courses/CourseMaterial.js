import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Image, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseMaterial = () => {
    const [selectedSubtopic, setSelectedSubtopic] = useState(null);
    const navigation = useNavigation();

    const course = {
        title: "React Native Course",
        welcomeVideo: require('../../../assets/videos/welcome.mp4'),
        topics: [
            {
                id: 1,
                title: "Introduction",
                subtopics: [
                    { id: 1, title: "What is React Native?", type: "video", progress: 0.5, time: "10 min" },
                    { id: 2, title: "History of React Native", type: "text", progress: 0.3, time: "5 min" },
                    { id: 6, title: "Introductory Quiz", type: "quiz", progress: 0.0, time: "15 min" },
                ],
            },
            {
                id: 2,
                title: "Fundamentals",
                subtopics: [
                    { id: 3, title: "Components", type: "video", progress: 0.8, time: "20 min" },
                    { id: 4, title: "State and Props", type: "text", progress: 0.4, time: "15 min" },
                ],
            },
            {
                id: 3,
                title: "Quiz",
                subtopics: [
                    { id: 5, title: "Final Quiz", type: "quiz", progress: 0.0, time: "30 min" },
                ],
            },
        ],
    };

    const renderSubtopic = ({ item, index }) => (
        <TouchableOpacity
            style={styles.subtopicCard}
            onPress={() => navigation.navigate('SubtopicDetails', { subtopic: item })}
        >
            <View style={styles.subtopicProgress}>
                <Svg width="60" height="60">
                    <G rotation="-90" originX="30" originY="30">
                        <Circle
                            stroke="#e6e6e6"
                            strokeWidth="4"
                            fill="none"
                            r="28"
                            cx="30"
                            cy="30"
                        />
                        <Circle
                            stroke={Colors.PRIMARY}
                            strokeWidth="4"
                            fill="none"
                            r="28"
                            cx="30"
                            cy="30"
                            strokeDasharray={`${item.progress * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                        />
                    </G>
                </Svg>
                <Text style={styles.progressNumber}>{index + 1}</Text>
            </View>
            <View style={styles.subtopicDetails}>
                <Text style={styles.subtopicTitle}>{item.title}</Text>
                <Text style={styles.subtopicTime}>
                    {item.type === 'video' ? `Video Length: ${item.time}` :
                     item.type === 'text' ? `Reading Time: ${item.time}` :
                     item.type === 'quiz' ? `Time to Complete: ${item.time}` :
                     ''}
                </Text>
            </View>
            <Ionicons
                name={item.type === 'video' ? 'videocam-outline' : item.type === 'text' ? 'document-text-outline' : 'clipboard-outline'}
                size={24}
                color={Colors.PRIMARY}
                style={styles.subtopicTypeIcon}
            />
        </TouchableOpacity>
    );
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={Colors.WHITE} />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <ProgressBar progress={0.5} color={Colors.WHITE} style={styles.progressBar} />
                </View>
                <Image source={require('../../../assets/Images/DesignUi.png')} style={styles.headerImage} />
            </View>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Video
                source={course.welcomeVideo}
                style={styles.welcomeVideo}
                useNativeControls
                resizeMode="cover"
            />
            <SectionList
                sections={course.topics.map(topic => ({ title: topic.title, data: topic.subtopics }))}
                renderItem={renderSubtopic}
                keyExtractor={(item) => item.id.toString()}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.topicTitle}>{section.title}</Text>
                )}
            />
        </View>
    );
};

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
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    progressContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBar: {
        height: 10,
        width: '80%',
        borderRadius: 5,
    },
    headerImage: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.4,
        position: 'absolute',
        top: 20,
        right: 0,
        zIndex: -1,
        opacity: 0.8,
    },
    courseTitle: {
        fontSize: screenWidth * 0.045,
        fontFamily: 'Poppins-Medium',
        paddingHorizontal: 15,
        marginVertical: 10,
        color: Colors.SECONDARY,
    },
    welcomeVideo: {
        height: screenHeight * 0.3,
        marginHorizontal: 15,
        borderRadius: 10,
        marginVertical: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicTitle: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Poppins-Medium',
        paddingHorizontal: 15,
        marginVertical: 10,
        color: Colors.SECONDARY,
    },
    subtopicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        margin: 10,
        justifyContent: 'space-between', // Align items to the start and end
    },
    subtopicProgress: {
        width: 60,
        height: 60,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible', // Ensure overflow is visible
    },
    progressNumber: {
        position: 'absolute',
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        fontWeight: 'bold',
        color: '#777',
    },
    subtopicDetails: {
        flex: 1,
    },
    subtopicTitle: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
        marginBottom: 4,
    },
    subtopicTime: {
        fontSize: screenWidth * 0.025,
        fontFamily: 'Poppins',
        color: '#555',
    },
    subtopicTypeIcon: {
        marginLeft: 10,
    },
});

export default CourseMaterial;
