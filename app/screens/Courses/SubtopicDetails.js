import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import demoVideo from '../../../assets/videos/welcome.mp4';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SubtopicDetails = ({ route }) => {
    const { subtopic } = route.params;
    const [activeTab, setActiveTab] = useState('transcripts');
    const [notes, setNotes] = useState('');
    const navigation = useNavigation();
    
    // Create a ref for the RichEditor
    const editorRef = useRef(null);

   
    const handleFullscreen = () => {
        // Handle fullscreen toggle
        setOrientationLocked(true);
    };

    const handleExitFullscreen = () => {
        // Handle exit fullscreen
        setOrientationLocked(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color={Colors.WHITE} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{subtopic.title}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {subtopic.type === 'video' && (
                    <Video
                        source={demoVideo}
                        style={styles.subtopicVideo}
                        useNativeControls
                        resizeMode="cover"
                        onFullscreenUpdate={({ status }) => {
                            if (status === Video.FULLSCREEN_UPDATE_PLAYER_DID_ENTER_FULLSCREEN) {
                                handleFullscreen();
                            } else if (status === Video.FULLSCREEN_UPDATE_PLAYER_DID_EXIT_FULLSCREEN) {
                                handleExitFullscreen();
                            }
                        }}
                    />
                )}
                {subtopic.type === 'text' && (
                    <View style={styles.textContainer}>
                        <Text style={styles.textTitle}>Text Content</Text>
                        <Text style={styles.textContent}>
                            This is a sample text content for the subtopic. It will be displayed when the subtopic type is 'text', you can also add images .
                        </Text>
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Mark as Complete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {subtopic.type === 'quiz' && (
                    <View style={styles.quizContainer}>
                        <Text style={styles.quizTitle}>Quiz Content</Text>
                        <Text style={styles.quizDescription}>
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
                    <Text style={styles.transcriptText}>Transcripts content...</Text>
                )}
                {activeTab === 'notes' && (
                    <View style={styles.notesContainer}>
                        <RichEditor
                            ref={editorRef}  // Assign ref to RichEditor
                            style={styles.notesEditor}
                            initialContentHTML={notes}
                            onChange={setNotes}
                        />
                        <RichToolbar
                            editor={editorRef}  // Pass ref to RichToolbar
                            actions={['bold', 'italic', 'underline', 'strikethrough', 'heading1', 'heading2', 'insertOrderedList', 'insertUnorderedList']}
                            style={styles.toolbar}
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
    textTitle: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
    },
    textContent: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins',
    },
    quizContainer: {
        marginBottom: 20,
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    quizTitle: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
    },
    quizDescription: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins',
        marginBottom: 20,
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
    notesContainer: {
        marginBottom: 20,
    },
    notesEditor: {
        minHeight: screenHeight * 0.06,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        borderRadius: 5,
    },
    toolbar: {
        borderTopColor: '#ddd',
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
