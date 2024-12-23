import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EnrolledCourseCard from '../../components/Courses/EnrolledCourseCard';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const enrollmentsQuery = query(collection(db, 'Enrollments'), where('userId', '==', user.uid));
          const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
          const courses = enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const coursesWithDetails = await Promise.all(courses.map(async (course) => {
            const courseRef = doc(db, 'courses', course.courseId);
            const courseDoc = await getDoc(courseRef);
            const courseData = courseDoc.exists() ? courseDoc.data() : {};

            const reviewsQuery = query(collection(db, 'reviews'), where('courseId', '==', course.courseId));
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviews = reviewsSnapshot.docs.map(doc => doc.data());
            const ratings = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

            return {
              ...course,
              title: courseData.title || 'Unknown',
              image: courseData.image || '',
              category: courseData.category || 'Unknown',
              tutorName: courseData.author || 'Unknown',
              tutorImage: courseData.avatar || '',
              ratings,
              reviews: reviews.length,
              progress: course.progress || 0,
            };
          }));

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

  const handleCoursePress = async (courseId, progress) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const enrollmentRef = doc(db, 'Enrollments', courseId);
        await updateDoc(enrollmentRef, { progress: progress });

        if (progress === 0) {
          navigation.navigate('CourseEnrolment', { courseId });
        } else {
          navigation.navigate('CourseMaterial', { courseId });
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
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
      onPress={() => handleCoursePress(item.id, item.progress)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
});

export default EnrolledCourses;