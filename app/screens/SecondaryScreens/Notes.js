import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import Colors from '../../../assets/Utils/Colors';
import NoteCard from '../../components/Courses/NotesCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Sample data for notes
const notesData = [
    {
        date: '2024-08-12',
        notes: [
            { id: '1', content: 'First note of the day, a detailed note to check how it works in practice.', topic: 'Topic 1', imageUri: 'https://example.com/image1.jpg' },
            { id: '2', content: 'Second note of the day with more information and details.', topic: 'Topic 2', imageUri: 'https://example.com/image2.jpg' },
        ],
    },
    {
        date: '2024-08-13',
        notes: [
            { id: '3', content: 'Note from the next day with additional insights and information.', topic: 'Topic 3', imageUri: 'https://example.com/image3.jpg' },
        ],
    },
];

const Notes = () => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>
                {format(new Date(item.date), 'MMMM dd, yyyy')}
            </Text>
            {item.notes.map(note => (
                <NoteCard
                    key={note.id}
                    content={note.content}
                    topic={note.topic}
                    imageUri={note.imageUri}
                />
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notes</Text>
                <Image source={require('../../../assets/Images/DesignUi4.png')} style={styles.headerImage} />
            </View>
            <FlatList
                data={notesData}
                renderItem={renderItem}
                keyExtractor={item => item.date}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        
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
    headerImage: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.4,
        position: 'absolute',
        top: 20,
        right: 0,
        zIndex: -1,
        opacity: 0.8,
    },
    sectionContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingTop: screenHeight * 0.03,
    },
    sectionHeader: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
        textAlign: 'center',
        color: '#777',
    },
    flatListContent: {
        paddingBottom: 20,
    },
});

export default Notes;
