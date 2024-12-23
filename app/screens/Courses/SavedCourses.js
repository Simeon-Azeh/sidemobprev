import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebaseConfig';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const SavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSavedCourses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const savedCoursesQuery = query(collection(db, 'SavedCourses'), where('userId', '==', user.uid));
          const savedCoursesSnapshot = await getDocs(savedCoursesQuery);
          const savedCourses = savedCoursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const coursesWithDetails = await Promise.all(savedCourses.map(async (savedCourse) => {
            const courseRef = doc(db, 'courses', savedCourse.courseId);
            const courseDoc = await getDoc(courseRef);
            const courseData = courseDoc.exists() ? courseDoc.data() : {};

            const reviewsQuery = query(collection(db, 'reviews'), where('courseId', '==', savedCourse.courseId));
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviews = reviewsSnapshot.docs.map(doc => doc.data());
            const ratings = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

            return {
              ...savedCourse,
              title: courseData.title || 'Unknown',
              image: courseData.image || '',
              category: courseData.category || 'Unknown',
              level: courseData.level || 'Unknown',
              timeToComplete: courseData.timeToComplete || 'Unknown',
              ratings,
              reviews: reviews.length,
            };
          }));

          setSavedCourses(coursesWithDetails);
        }
      } catch (error) {
        console.error("Error fetching saved courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCourses();
  }, []);

  const handleCoursePress = async (courseId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const enrollmentsQuery = query(collection(db, 'Enrollments'), where('userId', '==', user.uid), where('courseId', '==', courseId));
        const enrollmentsSnapshot = await getDocs(enrollmentsQuery);

        if (enrollmentsSnapshot.empty) {
          // Navigate to enrollment page if not enrolled
          navigation.navigate('CourseEnrolment', { courseId });
        } else {
          // Navigate to course material page if already enrolled
          navigation.navigate('CourseMaterial', { courseId });
        }
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (savedCourses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome6 name="bookmark" size={50} color={Colors.PRIMARY} />
        <Text style={styles.emptyText}>You have no saved courses.</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Courses')}
        >
          <Text style={styles.exploreButtonText}>Explore Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      {savedCourses.map((course, index) => (
        <TouchableOpacity key={index} onPress={() => handleCoursePress(course.courseId)}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            padding: 10,
            marginBottom: 20,
          }}>
            <Image
              source={{ uri: course.image }}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 8,
              }}
            />
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>{course.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <MaterialIcons name="school" size={20} color="#9835ff" />
                <Text style={{ marginLeft: 5, fontSize: 14, color: '#9835ff', fontFamily: 'Poppins-Medium' }}>{course.level}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <MaterialCommunityIcons name="timelapse" size={18} color="#a9a9a9" />
                <Text style={{ fontSize: 14, color: '#a9a9a9', marginLeft: 2, fontFamily: 'Poppins-Medium' }}>{course.timeToComplete}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <MaterialIcons name="star" size={20} color="#f1c40f" />
                <Text style={{ marginLeft: 5, fontSize: 14, color: '#a9a9a9', fontFamily: 'Poppins' }}>{course.ratings.toFixed(1)} ({course.reviews} reviews)</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
    marginVertical: 20,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
};

export default SavedCourses;