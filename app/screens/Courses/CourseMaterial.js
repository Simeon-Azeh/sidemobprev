import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Image, Dimensions, ActivityIndicator, Modal, Animated } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseMaterial = () => {
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const route = useRoute();
    const colorScheme = useColorScheme();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { courseTitle } = route.params;
                console.log("Fetching course with title:", courseTitle);

                const db = getFirestore();
                const coursesRef = collection(db, 'courses');
                const q = query(coursesRef, where('title', '==', courseTitle));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    throw new Error('Course not found');
                }

                const courseDoc = querySnapshot.docs[0];
                const data = courseDoc.data();
                console.log("Found course:", courseDoc.id);

                setCourseData({
                    id: courseDoc.id,
                    title: data.title,
                    welcomeVideo: data.welcomeVideo,
                    topics: data.curriculum || [],
                    author: data.author,
                    progress: data.progress || 0
                });
            } catch (err) {
                console.error("Error fetching course:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [route.params]);

    useEffect(() => {
        if (colorScheme === 'dark') {
            setModalVisible(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }).start(() => setModalVisible(false));
                }, 3000);
            });
        }
    }, [colorScheme]);

    const renderSubtopic = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.subtopicCard, colorScheme === 'dark' && styles.darkSubtopicCard]}
            onPress={() => navigation.navigate('SubtopicDetails', { 
                subtopic: item,
                courseId: courseData.id 
            })}
        >
            <View style={styles.subtopicProgress}>
                <Svg width="60" height="60">
                    <G rotation="-90" originX="30" originY="30">
                        <Circle
                            stroke={colorScheme === 'dark' ? '#333' : '#e6e6e6'}
                            strokeWidth="4"
                            fill="none"
                            r="28"
                            cx="30"
                            cy="30"
                        />
                        <Circle
                            stroke={colorScheme === 'dark' ? Colors.WHITE : Colors.PRIMARY}
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
                <Text style={[styles.subtopicTitle, colorScheme === 'dark' && styles.darkSubtopicTitle]}>{item.title}</Text>
                <Text style={[styles.subtopicTime, colorScheme === 'dark' && styles.darkSubtopicTime]}>
                    {item.type === 'video' ? `Video Length: ${item.time}` :
                     item.type === 'text' ? `Reading Time: ${item.time}` :
                     item.type === 'quiz' ? `Time to Complete: ${item.time}` :
                     ''}
                </Text>
            </View>
            <Ionicons
                name={item.type === 'video' ? 'videocam-outline' : 
                     item.type === 'text' ? 'document-text-outline' : 
                     'clipboard-outline'}
                size={24}
                color={colorScheme === 'dark' ? Colors.WHITE : Colors.PRIMARY}
                style={styles.subtopicTypeIcon}
            />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
            >
                <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                    <View style={[styles.modalContent, colorScheme === 'dark' && styles.darkModalContent]}>
                        <Ionicons name="alert-circle-outline" size={40} color={colorScheme === 'dark' ? Colors.WHITE : Colors.PRIMARY} />
                        <Text style={[styles.modalText, colorScheme === 'dark' && styles.darkModalText]}>Switch to light mode for a better experience</Text>
                    </View>
                </Animated.View>
            </Modal>
            <View style={[styles.header, colorScheme === 'dark' && styles.darkHeader]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={Colors.WHITE} />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <ProgressBar 
                        progress={courseData?.progress || 0} 
                        color={Colors.WHITE} 
                        style={styles.progressBar} 
                    />
                </View>
                <Image source={require('../../../assets/Images/DesignUi.png')} style={styles.headerImage} />
            </View>
            <Text style={[styles.courseTitle, colorScheme === 'dark' && styles.darkCourseTitle]}>{courseData?.title}</Text>
            {courseData?.welcomeVideo && (
                <Video
                    source={{ uri: courseData.welcomeVideo }}
                    style={styles.welcomeVideo}
                    useNativeControls
                    resizeMode="cover"
                />
            )}
            <SectionList
                sections={courseData?.topics.map(topic => ({ 
                    title: topic.title, 
                    data: topic.subModules || [] 
                })) || []}
                renderItem={renderSubtopic}
                keyExtractor={(item, index) => `${item.id || index}`}
                renderSectionHeader={({ section }) => (
                    <Text style={[styles.topicTitle, colorScheme === 'dark' && styles.darkTopicTitle]}>{section.title}</Text>
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
    darkContainer: {
        backgroundColor: '#000',
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
    darkHeader: {
        backgroundColor: Colors.DARK_PRIMARY,
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
    darkCourseTitle: {
        color: Colors.WHITE,
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
    darkTopicTitle: {
        color: Colors.WHITE,
    },
    subtopicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        margin: 10,
        justifyContent: 'space-between',
    },
    darkSubtopicCard: {
        backgroundColor: '#333',
    },
    subtopicProgress: {
        width: 60,
        height: 60,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
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
    darkSubtopicTitle: {
        color: Colors.WHITE,
    },
    subtopicTime: {
        fontSize: screenWidth * 0.025,
        fontFamily: 'Poppins',
        color: '#555',
    },
    darkSubtopicTime: {
        color: '#ccc',
    },
    subtopicTypeIcon: {
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    darkModalContent: {
        backgroundColor: '#333',
    },
    modalText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
        marginTop: 10,
    },
    darkModalText: {
        color: Colors.WHITE,
    },
});

export default CourseMaterial;