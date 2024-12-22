import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const FullNote = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { content, topic } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color="#fff" />
                </TouchableOpacity>
            <Text style={styles.headerTitle}>{topic}</Text>
                <Image source={require('../../../assets/Images/DesignUi4.png')} style={styles.headerImage} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.content}>{content}</Text>
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
    backButton: {
        position: 'absolute',
        left: 20,
        top: 40,
        zIndex: 10,
    },
    scrollContainer: {
        padding: 20,
    },
    topic: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
        color: '#333',
    },
    content: {
        fontSize: 16,
        fontFamily: 'Poppins',
        color: '#333',
    },
});

export default FullNote;
