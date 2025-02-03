import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, useColorScheme } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RenderHtml from 'react-native-render-html';
import { decode } from 'html-entities';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SubtopicDetails = ({ route }) => {
    const { subtopic, courseId, userId } = route.params;
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('transcripts');
    const [notes, setNotes] = useState('');
    const navigation = useNavigation();
    const editorRef = useRef(null);
    const colorScheme = useColorScheme();

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const db = getFirestore();
                const courseRef = doc(db, 'courses', courseId);
                const courseDoc = await getDoc(courseRef);

                if (!courseDoc.exists()) {
                    throw new Error('Course not found');
                }

                const courseData = courseDoc.data();
                const curriculum = courseData.curriculum || [];

                // Find the specific submodule content
                let submoduleContent = null;
                curriculum.forEach(module => {
                    const foundSubmodule = module.subModules.find(
                        sub => sub.title === subtopic.title
                    );
                    if (foundSubmodule) {
                        submoduleContent = foundSubmodule.content;
                    }
                });

                if (!submoduleContent) {
                    throw new Error('Content not found');
                }

                setContent(decode(submoduleContent));
            } catch (err) {
                console.error("Error fetching content:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [courseId, subtopic]);

    const handleMarkAsComplete = async () => {
        try {
            const db = getFirestore();
            const enrollmentRef = doc(db, 'enrollments', userId);
            await updateDoc(enrollmentRef, {
                progress: 'completed' // Update this field as needed
            });
            alert('Marked as complete!');
        } catch (err) {
            console.error("Error updating progress:", err);
            alert('Failed to update progress.');
        }
    };

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
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
            <View style={[styles.header, colorScheme === 'dark' && styles.darkHeader]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={Colors.WHITE} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{subtopic.title}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {subtopic.type === 'video' && (
                    <Video
                        source={{ uri: content }}
                        style={styles.subtopicVideo}
                        useNativeControls
                        resizeMode="cover"
                    />
                )}
                {subtopic.type === 'text' && (
                    <View style={[styles.textContainer, colorScheme === 'dark' && styles.darkTextContainer]}>
                        <RenderHtml
                             contentWidth={screenWidth - 40} // Account for padding
                             source={{ html: content }}
                             baseStyle={{
                                fontFamily: 'System',  // Default system font
                                color: colorScheme === 'dark' ? '#fff' : '#000',
                                fontSize: 14
                            }}
                             tagsStyles={{
                                 p: { 
                                     marginBottom: 8, 
                                     color: colorScheme === 'dark' ? '#fff' : '#000',
                                     fontFamily: 'Poppins',
                                     fontSize: 16,
                                     lineHeight: 20,
                                     fontWeight: 'normal'
                                 },
                                 b: { 
                                     fontWeight: 'bold', 
                                     color: colorScheme === 'dark' ? '#fff' : '#000',
                                     fontFamily: 'Poppins-Bold'
                                 },
                                 ul: { 
                                     marginVertical: 8,
                                     color: colorScheme === 'dark' ? '#fff' : '#000',
                                     fontFamily: 'Poppins'
                                 },
                                 li: { 
                                     marginBottom: 4,
                                     color: colorScheme === 'dark' ? '#fff' : '#000',
                                     fontFamily: 'Poppins',
                                     fontSize: 16,

                                     
                                 },
                                 img: { 
                                     maxWidth: screenWidth - 80, // Account for container padding
                                     height: 200,
                                     alignSelf: 'center',
                                     resizeMode: 'contain',
                                     borderRadius: 8
                                 },
                                 h1: {
                                     fontFamily: 'Poppins-Bold',
                                     fontSize: 24,
                                     marginVertical: 12,
                                     color: colorScheme === 'dark' ? '#fff' : '#000'
                                 },
                                 h2: {
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 20,
                                    marginVertical: 10,
                                    color: colorScheme === 'dark' ? '#fff' : '#000'
                                },
                                h3: {
                                    fontFamily: 'Poppins-Medium',
                                    fontSize: 18,
                                    marginVertical: 8,
                                    color: colorScheme === 'dark' ? '#fff' : '#000'
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleMarkAsComplete}>
                            <Text style={styles.submitButtonText}>Mark as Complete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {subtopic.type === 'quiz' && (
                    <View style={[styles.quizContainer, colorScheme === 'dark' && styles.darkQuizContainer]}>
                        <Text style={[styles.quizTitle, colorScheme === 'dark' && styles.darkQuizTitle]}>Quiz Content</Text>
                        <Text style={[styles.quizDescription, colorScheme === 'dark' && styles.darkQuizDescription]}>
                            This is a sample quiz content. Here you can display quiz instructions, questions, and options for the user to interact with.
                        </Text>
                        <TouchableOpacity style={styles.startQuizButton}>
                            <Text style={styles.startQuizButtonText}>Start Quiz</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {subtopic.type === 'video' && (
                    <View style={styles.tabContainer}>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('transcripts')} 
                            style={[styles.tab, activeTab === 'transcripts' && styles.activeTab]}
                        >
                            <Text style={styles.tabText}>Transcripts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('notes')} 
                            style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
                        >
                            <Text style={styles.tabText}>Notes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('resources')} 
                            style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
                        >
                            <Text style={styles.tabText}>Resources</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {subtopic.type === 'video' && activeTab === 'transcripts' && (
                    <Text style={[styles.transcriptText, colorScheme === 'dark' && styles.darkTranscriptText]}>Transcripts content...</Text>
                )}
                {activeTab === 'notes' && (
                    <View style={styles.notesContainer}>
                        <RichEditor
                            ref={editorRef}  // Assign ref to RichEditor
                            style={[styles.notesEditor, colorScheme === 'dark' && styles.darkNotesEditor]}
                            initialContentHTML={notes}
                            onChange={setNotes}
                        />
                        <RichToolbar
                            editor={editorRef}  // Pass ref to RichToolbar
                            actions={['bold', 'italic', 'underline', 'strikethrough', 'heading1', 'heading2', 'insertOrderedList', 'insertUnorderedList']}
                            style={[styles.toolbar, colorScheme === 'dark' && styles.darkToolbar]}
                        />
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Add Notes</Text>
                            <MaterialIcons name="post-add" size={24} color="#fff" style={{ marginTop: -5 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.submitButton, { backgroundColor: Colors.WHITE, borderColor: Colors.PRIMARY, borderWidth: 1 }]} onPress={() => navigation.navigate('Notes')}>
                            <Text style={[styles.submitButtonText, { color: Colors.PRIMARY }]}>View Notes</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {activeTab === 'resources' && (
                    <View style={styles.resourcesContainer}>
                        <TouchableOpacity style={styles.resourceLink}>
                            <Ionicons name="cloud-download-outline" size={24} color={Colors.PRIMARY} />
                            <Text style={styles.resourceText}>Download Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resourceLink}>
                            <Ionicons name="cloud-download-outline" size={24} color={Colors.PRIMARY} />
                            <Text style={styles.resourceText}>Download Transcript</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.likeButton}>
                        <AntDesign name="like2" size={18} color={Colors.PRIMARY} />
                        <Text style={styles.actionButtonText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reportButton}>
                        <Ionicons name="flag-outline" size={18} color={Colors.SECONDARY} />
                        <Text style={styles.actionButtonText}>Report</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        position: 'relative',
    },
    darkHeader: {
        backgroundColor: Colors.DARK_PRIMARY,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 40,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: screenWidth * 0.05,
        color: Colors.WHITE,
        fontFamily: 'Poppins-Medium',
        flex: 1,
        textAlign: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    subtopicVideo: {
        height: screenHeight * 0.25,
        width: '100%',
        borderRadius: 10,
        marginVertical: 20,
        marginBottom: 20,
    },
    textContainer: {
        marginTop: 20,
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    darkTextContainer: {
        backgroundColor: '#333',
    },
    textTitle: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
    },
    textContent: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins',
    },
    darkTextContent: {
        color: '#fff',
    },
    quizContainer: {
        marginBottom: 20,
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    darkQuizContainer: {
        backgroundColor: '#333',
    },
    quizTitle: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
    },
    darkQuizTitle: {
        color: '#fff',
    },
    quizDescription: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins',
        marginBottom: 20,
    },
    darkQuizDescription: {
        color: '#ccc',
    },
    startQuizButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    startQuizButtonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    transcriptText: {
        fontSize: screenWidth * 0.03,
        marginBottom: 20,
        fontFamily: 'Poppins-Medium',
        color: Colors.SECONDARY,
    },
    darkTranscriptText: {
        color: '#ccc',
    },
    notesContainer: {
        marginBottom: 20,
    },
    notesEditor: {
        minHeight: screenHeight * 0.06,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
    },
    darkNotesEditor: {
        backgroundColor: '#333',
        color: '#fff',
    },
    toolbar: {
        borderTopColor: '#ddd',
    },
    darkToolbar: {
        backgroundColor: '#333',
        borderTopColor: '#555',
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5
    },
    submitButtonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    resourcesContainer: {
        marginBottom: 20,
    },
    resourceLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    resourceText: {
        marginLeft: 10,
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        color: Colors.PRIMARY,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 20,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    actionButtonText: {
        marginLeft: 5,
        fontSize: screenWidth * 0.03,
        color: Colors.SECONDARY,
        fontFamily: 'Poppins-Medium',
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    tab: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: Colors.PRIMARY,
    },
    tabText: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        color: Colors.SECONDARY,
    },
});

export default SubtopicDetails;