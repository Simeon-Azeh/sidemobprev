import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

const placeholderImageUri = 'https://via.placeholder.com/24'; // Placeholder image URL

const NoteCard = ({ content, topic, viewers = [], lastEdited }) => {
    const navigation = useNavigation();

    // Function to handle "View" button click
    const handleView = () => {
        navigation.navigate('FullNote', { content, topic });
    };

    return (
        <View style={styles.card}>
            {/* Notes icon */}
            <View style={styles.iconRow}>
                <Ionicons name="document-text-outline" size={24} color={Colors.PRIMARY} />
                <View style={styles.viewerSection}>
                    {viewers.map((viewer, index) => (
                        <Image
                            key={index}
                            source={{ uri: viewer || placeholderImageUri }} // Use placeholder if viewer image is not available
                            style={[styles.viewerImage, { zIndex: viewers.length - index }]}
                        />
                    ))}
                    <Text style={styles.viewerCount}>{viewers.length} viewers</Text>
                </View>
            </View>

            {/* Edit and Share buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Feather name="share-2" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
            </View>

            {/* Last edited text */}
            <Text style={styles.lastEdited}>{`Last edited: ${lastEdited}`}</Text>

            {/* Truncated note and View button */}
            <Text style={styles.topic}>{topic}</Text>
            <Text style={styles.noteContent}>{`${content.slice(0, 50)}...`}</Text>
            <TouchableOpacity style={styles.viewButton} onPress={handleView}>
                <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    viewerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    viewerImage: {
        width: screenWidth * 0.06,
        height: screenWidth * 0.06,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
        marginLeft: -10,  // Stack images
    },
    viewerCount: {
        marginLeft: 15,
        fontSize: screenWidth * 0.03,
        color: Colors.SECONDARY,
        fontFamily: 'Poppins-Medium',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    actionButton: {
        marginLeft: 10,
    },
    lastEdited: {
        fontSize: screenWidth * 0.028,
        fontFamily: 'Poppins',
        color: '#777',
        marginBottom: 10,
    },
    topic: {
        fontSize: screenWidth * 0.035,
        fontFamily: 'Poppins-Medium',
        color: Colors.SECONDARY,
        marginBottom: 5,
    },
    noteContent: {
        fontSize: screenWidth * 0.03,
        fontFamily: 'Poppins',
        color: '#777',
        marginBottom: 10,
    },
    viewButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    viewButtonText: {
        color: '#fff',
        fontFamily: 'Poppins-Medium',
        fontSize: screenWidth * 0.03,
    },
});

export default NoteCard;
