import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CourseEnrolment = ({ navigation }) => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);


  const course = {
    title: 'Introduction to React Native',
    author: 'Jane Doe',
    category: 'Tech',
    publishDate: 'Jan 15, 2024',
    enrollments: '2500',
    tcomplete: '7 hours',
    Lessons: '20',
    description: 'This course provides an introduction to React Native. You will learn about components, state management, and how to build cross-platform mobile applications. It covers various topics including navigation, UI design, and data handling. You will also get hands-on experience by building a sample app.',
    objectives: ['Understand React Native basics', 'Build mobile apps', 'Manage state effectively'],
    material: [
      { title: 'Introduction', subtopics: ['Overview', 'Setup'], locked: true },
      { title: 'Components', subtopics: ['Function Components', 'Class Components'], locked: false },
    ],
    reviews: [
      { id: '1', user: 'John Doe', comment: 'Great course!', likes: 10, replies: 2, avatar: 'https://via.placeholder.com/40' },
      { id: '2', user: 'Alice Smith', comment: 'Very informative.', likes: 5, replies: 1, avatar: 'https://via.placeholder.com/40' }
    ],
    price: 'Free',
  };

  const toggleTopic = (index) => {
    setExpandedTopicIndex(expandedTopicIndex === index ? null : index);
  };

  

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/400' }} style={styles.backgroundImage} />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
        <MaterialIcons name="chevron-left" size={40} color={Colors.SECONDARY} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.headerActions}>
            <MaterialCommunityIcons name="bookmark-outline" size={30} color={Colors.SECONDARY} />
          </View>
        </View>

        <View style={styles.courseInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.authorImage} />
          <Text style={styles.authorName}>{course.author}</Text>
          <Text style={styles.courseCategory}>{course.category}</Text>
        </View>

        <View style={styles.infoBoxes}>
            
          <View style={styles.infoBox}>
          <MaterialIcons name="calendar-today" size={30} color="#9835ff" style={{ marginRight: 10}}/>
          <View>
          <Text style={{fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035}}>Published</Text>
          <Text style={styles.infoText}>{course.publishDate}</Text>
          </View>
           
          </View>
          <View style={styles.infoBox}>
          <MaterialIcons name="people" size={30} color="#9835ff" style={{ marginRight: 10}} />
            <View>
            <Text style={{fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035}}>Enrolled</Text>
            <Text style={styles.infoText}>{course.enrollments} People</Text>
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
          {course.objectives.map((objective, index) => (
            <View key={index} style={styles.objectiveContainer}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.PRIMARY} />
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBoxes}>
            
            <View style={styles.infoBox}>
            <MaterialIcons name="lock-clock" size={30} color="#9835ff" style={{ marginRight: 10}}/>
            <View>
            <Text style={{fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035}}>Time to Complete</Text>
            <Text style={styles.infoText}>{course.tcomplete}</Text>
            </View>
             
            </View>
            <View style={styles.infoBox}>
            <MaterialIcons name="people" size={30} color="#9835ff" style={{ marginRight: 10}} />
              <View>
              <Text style={{fontFamily: 'Poppins-Medium', color: Colors.SECONDARY, fontSize: screenWidth * 0.035}}>Lessons</Text>
              <Text style={styles.infoText}>{course.Lessons} Lessons</Text>
              </View>
            
            </View>
          </View>
  

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Course Material</Text>
          {course.material.map((item, index) => (
            <View key={index} style={styles.materialContainer}>
              <TouchableOpacity onPress={() => toggleTopic(index)}>
                <Text style={styles.materialTitle}>
                  {item.title}
                
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#333" style={styles.dropdownIcon} />
                </Text>
           
              </TouchableOpacity>
              {expandedTopicIndex === index && item.subtopics.map((subtopic, subIndex) => (
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
          {course.reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <View style={styles.reviewActions}>
                  <TouchableOpacity style={styles.reviewActionButton}>
                    <MaterialCommunityIcons name="thumb-up-outline" size={20} color={Colors.SECONDARY} />
                    <Text style={styles.reviewActionText}>{review.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reviewActionButton}>
                    <MaterialCommunityIcons name="comment-outline" size={20} color={Colors.SECONDARY} />
                    <Text style={styles.reviewActionText}>{review.replies}</Text>
                    <Text style={styles.showRepliesButton}>Show Replies</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.addReviewContainer}>
            <TextInput style={styles.addReviewInput} placeholder="Add your review..." multiline />
            <TouchableOpacity style={styles.addReviewButton}>
              <Text style={styles.addReviewButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
          <View>
          <Text style={{fontFamily: 'Poppins-Medium', color: Colors.SECONDARY}}>Price: </Text>
          <Text style={styles.price}>{course.price}</Text>
          </View>
          <TouchableOpacity 
  style={styles.enrollButton} 
  onPress={() => navigation.navigate('CourseMaterial')}
>
  <Text style={styles.enrollButtonText}>Enroll</Text>
</TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
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
    fontSize: screenWidth * 0.035,
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
   
    fontFamily: 'Poppins',
    color: '#888',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  description: {
    fontSize: screenWidth * 0.03,
    color: '#555',
    lineHeight: 20,
    textAlign: 'justify',
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
    marginLeft: 10,
  },
  materialContainer: {
    marginBottom: 10,
  },
  materialTitle: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
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
  },
  subtopicText: {
    fontSize: screenWidth * 0.035,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
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
