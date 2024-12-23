import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseEnrolment = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [saved, setSaved] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(4);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchCourse = async () => {
      const db = getFirestore();
      const courseRef = doc(db, 'courses', courseId);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists()) {
        setCourse(courseDoc.data());
      } else {
        console.log('No such document!');
      }
    };

    const fetchReviews = async () => {
      const db = getFirestore();
      const reviewsRef = collection(db, 'reviews');
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviewsList = reviewsSnapshot.docs
        .filter(doc => doc.data().courseId === courseId)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsList);
    };

    const checkIfSaved = async () => {
      const db = getFirestore();
      const savedCoursesRef = collection(db, 'SavedCourses');
      const q = query(savedCoursesRef, where('userId', '==', currentUser.uid), where('courseId', '==', courseId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setSaved(true);
      }
    };

    const checkIfEnrolled = async () => {
      const db = getFirestore();
      const enrollmentsRef = collection(db, 'Enrollments');
      const q = query(enrollmentsRef, where('userId', '==', currentUser.uid), where('courseId', '==', courseId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setEnrolled(true);
      }
    };

    fetchCourse();
    fetchReviews();
    checkIfSaved();
    checkIfEnrolled();
  }, [courseId]);

  const toggleTopic = (index) => {
    setExpandedTopicIndex(expandedTopicIndex === index ? null : index);
  };

  const handleAddReview = async () => {
    if (!newReview.trim()) return;

    setLoadingReview(true);

    const db = getFirestore();
    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    const avatar = userDoc.exists() ? userDoc.data().avatar : 'https://via.placeholder.com/40';

    const reviewData = {
      courseId,
      user: currentUser.email,
      comment: newReview,
      likes: [],
      replies: [],
      avatar,
    };

    try {
      await addDoc(collection(db, 'reviews'), reviewData);
      setReviews([...reviews, reviewData]);
      setNewReview('');
    } catch (error) {
      console.error('Error adding review:', error);
    } finally {
      setLoadingReview(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    const db = getFirestore();
    const reviewRef = doc(db, 'reviews', reviewId);

    try {
      await updateDoc(reviewRef, {
        likes: arrayUnion(currentUser.email),
      });
      setReviews(reviews.map(review => review.id === reviewId ? { ...review, likes: [...review.likes, currentUser.email] } : review));
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const handleSaveCourse = async () => {
    const db = getFirestore();
    const savedCoursesRef = collection(db, 'SavedCourses');
    const q = query(savedCoursesRef, where('userId', '==', currentUser.uid), where('courseId', '==', courseId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If already saved, delete the saved course
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, 'SavedCourses', docId));
      setSaved(false);
    } else {
      // Save the course
      const savedCourseData = {
        userId: currentUser.uid,
        courseId,
        courseTitle: course.title,
        courseImage: course.image,
      };

      try {
        await addDoc(savedCoursesRef, savedCourseData);
        setSaved(true);
        console.log('Course saved successfully');
      } catch (error) {
        console.error('Error saving course:', error);
      }
    }
  };

  const handleEnroll = async () => {
    if (enrolled) return;

    setLoadingEnroll(true);

    const db = getFirestore();
    const enrollmentData = {
      userId: currentUser.uid,
      courseId,
      courseTitle: course.title,
      courseImage: course.image,
      userEmail: currentUser.email,
    };

    try {
      await addDoc(collection(db, 'Enrollments'), enrollmentData);
      console.log('Enrolled successfully');
      setEnrolled(true);

      // Update enrollment count
      const enrollmentsRef = collection(db, 'Enrollments');
      const enrollmentsSnapshot = await getDocs(enrollmentsRef);
      const enrollmentCount = enrollmentsSnapshot.docs.filter(doc => doc.data().courseId === courseId).length;
      setCourse(prevCourse => ({ ...prevCourse, enrollments: enrollmentCount }));
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setLoadingEnroll(false);
    }
  };

  const handleShowMoreReviews = () => {
    setVisibleReviews(prevVisibleReviews => prevVisibleReviews + 4);
  };

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: course.image }} style={styles.backgroundImage} />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
        <MaterialIcons name="chevron-left" size={40} color={Colors.SECONDARY} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleSaveCourse}>
              <MaterialCommunityIcons name={saved ? "bookmark" : "bookmark-outline"} size={30} color={saved ? Colors.PRIMARY : Colors.SECONDARY} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.courseInfo}>
          <Image source={{ uri: course.avatar }} style={styles.authorImage} />
          <Text style={styles.authorName}>{course.author}</Text>
          <Text style={styles.courseCategory}>{course.category}</Text>
        </View>

        <View style={styles.infoBoxes}>
          <View style={styles.infoBox}>
            <MaterialIcons name="calendar-today" size={30} color="#9835ff" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035 }}>Published</Text>
              <Text style={styles.infoText}>{course.dateOfPublication}</Text>
            </View>
          </View>
          <View style={styles.infoBox}>
            <MaterialIcons name="people" size={30} color="#9835ff" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035 }}>Enrolled</Text>
              <Text style={styles.infoText}>{course.enrollments || 0} People</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {showMore ? course.description : `${course.description.substring(0, 50)}...`}
          </Text>
          <TouchableOpacity onPress={() => setShowMore(!showMore)}>
            <Text style={styles.readMore}>{showMore ? 'Read Less' : 'Read More'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Learning Objectives</Text>
          {course.learningObjectives && course.learningObjectives.map((objective, index) => (
            <View key={index} style={styles.objectiveContainer}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.PRIMARY} />
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBoxes}>
          <View style={styles.infoBox}>
            <MaterialIcons name="lock-clock" size={30} color="#9835ff" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035 }}>Time to Complete</Text>
              <Text style={styles.infoText}>{course.timeToComplete}</Text>
            </View>
          </View>
          <View style={styles.infoBox}>
            <MaterialIcons name="people" size={30} color="#9835ff" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035 }}>Lessons</Text>
              <Text style={styles.infoText}>{course.totalLessons} Lessons</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Course Material</Text>
          {course.courseMaterials && course.courseMaterials.map((item, index) => (
            <View key={index} style={styles.materialContainer}>
              <TouchableOpacity onPress={() => toggleTopic(index)}>
                <Text style={styles.materialTitle}>
                  {item.title}
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#333" style={styles.dropdownIcon} />
                </Text>
              </TouchableOpacity>
              {expandedTopicIndex === index && item.subMaterials && item.subMaterials.map((subtopic, subIndex) => (
                <View key={subIndex} style={styles.subtopicContainer}>
                  <Text style={styles.subtopicText}>
                    <MaterialCommunityIcons name="lock" size={16} color="#888" /> {subtopic}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.slice(0, visibleReviews).map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <View style={styles.reviewActions}>
                  <TouchableOpacity style={styles.reviewActionButton} onPress={() => handleLikeReview(review.id)}>
                    <MaterialCommunityIcons name="thumb-up-outline" size={20} color={Colors.SECONDARY} />
                    <Text style={styles.reviewActionText}>{review.likes.length}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {visibleReviews < reviews.length && (
            <TouchableOpacity onPress={handleShowMoreReviews}>
              <Text style={styles.readMore}>Show More</Text>
            </TouchableOpacity>
          )}
          <View style={styles.addReviewContainer}>
            <TextInput
              style={styles.addReviewInput}
              placeholder="Add your review..."
              multiline
              value={newReview}
              onChangeText={setNewReview}
            />
            <TouchableOpacity style={styles.addReviewButton} onPress={handleAddReview} disabled={loadingReview}>
              {loadingReview ? <ActivityIndicator color="#fff" /> : <Text style={styles.addReviewButtonText}>Submit Review</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={{ fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>Price: </Text>
          <Text style={styles.price}>{course.price}</Text>
        </View>
        <TouchableOpacity 
          style={styles.enrollButton} 
          onPress={handleEnroll}
          disabled={loadingEnroll || enrolled}
        >
          {loadingEnroll ? <ActivityIndicator color="#fff" /> : <Text style={styles.enrollButtonText}>{enrolled ? 'Enrolled' : 'Enroll'}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: screenWidth * 1,
    height: screenHeight * 0.2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scrollView: {
    flex: 1,
    marginTop: screenHeight * 0.21, 
  },
  scrollViewContent: {
    paddingBottom: 100, // Adjust to make room for the fixed footer
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  courseTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: screenHeight * -0.02,
    marginBottom: screenHeight * 0.02,
  },
  authorImage: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
    borderRadius: 50,
    marginRight: 10,
  },
  authorName: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  courseCategory: {
    fontSize: screenWidth * 0.025,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    textTransform: 'capitalize',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  infoBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.02,
    alignItems: 'center',
    gap: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0.2,
    width: screenWidth * 0.45,
  },
  infoText: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    color: '#888',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  description: {
    fontSize: screenWidth * 0.03,
    color: '#777',
    lineHeight: 20,
    textAlign: 'justify',
    fontFamily: 'Poppins-Medium',
  },
  readMore: {
    fontSize: screenWidth * 0.03,
    color: Colors.PRIMARY,
    marginTop: 5,
    fontFamily: 'Poppins',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  objectiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  objectiveText: {
    fontSize: screenWidth * 0.03,
    color: '#555',
    lineHeight: 20,
    textAlign: 'justify',
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
  },
  materialContainer: {
    marginBottom: 10,
  },
  materialTitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
    color: Colors.SECONDARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtopicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dropdownIcon: {
    color: Colors.PRIMARY,
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    transform: [{ rotate: '90deg' }],

  },
  subtopicText: {
    fontSize: screenWidth * 0.035,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
    fontFamily: 'Poppins-Medium',
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0.05,
  },
  reviewAvatar: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
    paddingBottom: 10,
  },
  reviewUser: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  reviewComment: {
    fontSize: screenWidth * 0.03,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
    fontFamily: 'Poppins',
    marginBottom: 5,
  },
  reviewActions: {
    flexDirection: 'row',
  },
  reviewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  reviewActionText: {
    fontSize: screenWidth * 0.03,
    marginLeft: 5,
    color: Colors.PRIMARY,
    fontFamily: 'Poppins',
  },
  showRepliesButton: {
    fontSize: screenWidth * 0.03,
    color: Colors.PRIMARY,
    marginLeft: 10,
    fontFamily: 'Poppins',
  },
  addReviewContainer: {
    marginTop: 20,
  },
  addReviewInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: screenHeight * 0.1,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.035,
    backgroundColor: '#fff',
  },
  addReviewButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
  },
  enrollButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});

export default CourseEnrolment;