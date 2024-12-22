import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EnrolledCourseCard from '../../components/Courses/EnrolledCourseCard';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Sample data for enrolled courses
const coursesData = [
    {
        id: '1',
        imageUri: 'https://bigbite.net/wp-content/uploads/2017/11/React.jpg',
        courseTitle: 'React Native Development',
        courseCategory: 'Mobile Development',
        hostImageUri: 'https://img.freepik.com/free-photo/business-african-american-man-using-virtual-reality-headset_23-2148764121.jpg?t=st=1723635641~exp=1723639241~hmac=e1a2bd6f1cbaf258b9586a638076ae60de064ff8444fed4711f8303eb392cfdd&w=740',
        hostName: 'John Doe',
        progress: 0.75,
    },
    {
        id: '2',
        imageUri: 'https://i.pinimg.com/736x/71/ee/32/71ee32577432648f9e45fbd63b2cf261.jpg',
        courseTitle: 'Advanced JavaScript',
        courseCategory: 'Web Development',
        hostImageUri: 'https://img.freepik.com/free-photo/man-listening-music_23-2148632178.jpg?t=st=1723635675~exp=1723639275~hmac=18e5f5de39b532c3952ebd7eaec22107b7f72508e9768834fea46d123f29a42e&w=740',
        hostName: 'Jane Smith',
        progress: 0.5,
    },
];

const EnrolledCourses = () => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <EnrolledCourseCard
            imageUri={item.imageUri}
            courseTitle={item.courseTitle}
            courseCategory={item.courseCategory}
            hostImageUri={item.hostImageUri}
            hostName={item.hostName}
            progress={item.progress}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={32} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Enrolled Courses</Text>
                <Image source={require('../../../assets/Images/DesignUi4.png')} style={styles.headerImage} />
            </View>
            <FlatList
                data={coursesData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
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
    headerImage: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.4,
        position: 'absolute',
        top: 20,
        right: 0,
        zIndex: -1,
        opacity: 0.8,
    },
    headerTitle: {
        fontSize: screenWidth * 0.05,
        color: Colors.WHITE,
        fontFamily: 'Poppins-Medium',
        flex: 1,
        textAlign: 'center',
    },
    flatListContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
});

export default EnrolledCourses;
