import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EnrolledCourseCard from '../../components/Courses/EnrolledCourseCard';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Get the current color scheme

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const enrollmentsQuery = query(
            collection(db, 'Enrollments'), 
            where('userId', '==', user.uid)
          );
          const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
          
          const coursesWithDetails = await Promise.all(
            enrollmentsSnapshot.docs.map(async (enrollDoc) => {
              const enrollData = enrollDoc.data();
              
              const courseRef = doc(db, 'courses', enrollData.courseId);
              const courseDoc = await getDoc(courseRef);
              console.log("Course document ID:", courseDoc.id); // Debug log
              
              const courseData = courseDoc.exists() ? courseDoc.data() : {};
              const reviewsQuery = query(
                collection(db, 'reviews'), 
                where('courseId', '==', enrollData.courseId)
              );
              const reviewsSnapshot = await getDocs(reviewsQuery);
              const reviews = reviewsSnapshot.docs.map(doc => doc.data());
              const ratings = reviews.length > 0 
                ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
                : 0;
    
              return {
                id: enrollDoc.id,
                courseId: courseDoc.id, // Use document ID from courseDoc
                progress: enrollData.progress || 0,
                title: courseData.title || 'Unknown',
                image: courseData.cover || courseData.courseImage || 'https://via.placeholder.com/150',
                category: courseData.category || 'Unknown',
                tutorName: courseData.author || 'Unknown',
                tutorImage: courseData.avatar || '',
                ratings,
                reviews: reviews.length,
                progress: enrollData.progress || 0,
              };
            })
          );
    
          setEnrolledCourses(coursesWithDetails);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleCoursePress = async (enrollmentId, courseId, progress) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const db = getFirestore();
            console.log("Navigation courseId:", courseId); // Debug log
            
            const enrollmentRef = doc(db, 'Enrollments', enrollmentId);
            await updateDoc(enrollmentRef, { progress: progress });

            // Ensure courseId is valid before navigation
            if (!courseId) {
                throw new Error('Invalid course ID for navigation');
            }

            navigation.navigate('CourseMaterial', { 
                courseId: courseId.toString(), // Ensure string type
                courseTitle: item.title 
            });
        }
    } catch (error) {
        console.error("Error in handleCoursePress:", error);
    }
};
  const renderItem = ({ item }) => (
    <EnrolledCourseCard
      imageUri={item.image}
      courseTitle={item.title}
      courseCategory={item.category}
      hostImageUri={item.tutorImage}
      hostName={item.tutorName}
      progress={item.progress}
      onPress={() => handleCoursePress(item.id, item.courseId, item.progress)}
    />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={[styles.loadingText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>Loading...</Text>
      </View>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <View style={[styles.noCoursesContainer, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
        <Ionicons name="book-outline" size={100} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT_MUTED} />
        <Text style={[styles.noCoursesText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>No enrolled courses available</Text>
        <TouchableOpacity style={[styles.exploreButton, { backgroundColor: Colors.PRIMARY }]} onPress={() => navigation.navigate('Courses')}>
          <Text style={[styles.exploreButtonText, { color: Colors.WHITE }]}>Explore Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
      <View style={[styles.header, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_SECONDARY }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={32} color={Colors.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enrolled Courses</Text>
        <Image source={require('../../../assets/Images/DesignUi4.png')} style={styles.headerImage} />
      </View>
      <FlatList
        data={enrolledCourses}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  noCoursesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoursesText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  exploreButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  exploreButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default EnrolledCourses;