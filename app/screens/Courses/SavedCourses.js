import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebaseConfig';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from 'react-native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const SavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  
const themeHeaderBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_SECONDARY;

  const themeBackgroundColor = colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND;
  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeCardBackgroundColor = colorScheme === 'light' ? Colors.WHITE : Colors.DARK_SECONDARY;
  const themeBorderColor = colorScheme === 'light' ? Colors.GRAY : Colors.DARK_BORDER;

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
              image: courseData.cover || 'https://via.placeholder.com/150',
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

  const handleCoursePress = (courseId) => {
    navigation.navigate('CourseEnrolment', { courseId });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeBackgroundColor }]}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={[styles.loadingText, { color: themeTextColor }]}>Loading...</Text>
      </View>
    );
  }

  if (savedCourses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: themeBackgroundColor }]}>
        <FontAwesome6 name="bookmark" size={50} color={Colors.PRIMARY} />
        <Text style={[styles.emptyText, { color: themeTextColor }]}>You have no saved courses.</Text>
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
    <View style={{ flex: 1, backgroundColor: themeBackgroundColor }}>
       <View style={[styles.header, { backgroundColor: themeHeaderBackgroundColor }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="chevron-left" size={42} color={Colors.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Courses</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {savedCourses.map((course, index) => (
          <TouchableOpacity key={index} onPress={() => handleCoursePress(course.courseId)}>
            <View style={[styles.courseCard, { backgroundColor: themeCardBackgroundColor, borderColor: themeBorderColor }]}>
              <Image
                source={{ uri: course.image }}
                style={styles.courseImage}
              />
              <View style={styles.courseDetails}>
                <Text style={[styles.courseTitle, { color: themeTextColor }]}>{course.title}</Text>
                <View style={styles.courseInfo}>
                  <MaterialIcons name="school" size={20} color="#9835ff" />
                  <Text style={[styles.courseLevel, { color: themeTextColor }]}>{course.level}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <MaterialCommunityIcons name="timelapse" size={18} color="#a9a9a9" />
                  <Text style={[styles.courseTime, { color: themeTextColor }]}>{course.timeToComplete}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <MaterialIcons name="star" size={20} color="#f1c40f" />
                  <Text style={[styles.courseRating, { color: themeTextColor }]}>{course.ratings.toFixed(1)} ({course.reviews} reviews)</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: screenHeight * 0.06, // Safe area padding
    height: screenHeight * 0.15,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    padding: 5,
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: screenWidth * 0.05,
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: 10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
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
  courseCard: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  courseImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  courseDetails: {
    padding: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  courseLevel: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  courseTime: {
    fontSize: 14,
    marginLeft: 2,
    fontFamily: 'Poppins-Medium',
  },
  courseRating: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
};

export default SavedCourses;