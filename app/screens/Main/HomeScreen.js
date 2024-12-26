import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import Header from '../../components/General/Header';
import GreetingCard from '../../components/General/GreetingCard';
import Colors from '../../../assets/Utils/Colors';
import StatsCard from '../../components/HomeScreen/StatsCard';
import StudyTracker from '../../components/HomeScreen/StudyTracker';
import RecommendedCoursesCarousel from '../../components/HomeScreen/RecommendedCoursesCarousel';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import HomeScreenSkeleton from '../../components/HomeScreenSkeleton';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const navigation = useNavigation();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  const themeBackgroundColor = colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BACKGROUND;
  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeCardBackgroundColor = colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_SECONDARY;
  const themeButtonBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON;
  const themeButtonTextColor = Colors.WHITE;
  const themeIconColor = colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.WHITE;
  const themeBorderColor = colorScheme === 'light' ? Colors.GRAY : Colors.DARK_BORDER;

  const sliderWidth = screenWidth;
  const itemWidth = screenWidth * 0.8;

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(getFirestore(), 'Enrollments'), where('userEmail', '==', user.email));
          const querySnapshot = await getDocs(q);
          const courses = [];
          for (const enrollmentDoc of querySnapshot.docs) {
            const data = enrollmentDoc.data();
            const courseRef = doc(getFirestore(), 'courses', data.courseId);
            const courseDoc = await getDoc(courseRef);
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              courses.push({
                id: enrollmentDoc.id,
                title: courseData.title,
                image: courseData.image,
                category: courseData.category || 'Unknown',
                progress: data.progress || 0,
              });
            }
          }
          setEnrolledCourses(courses);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const renderItem = ({ item }) => {
    const truncatedTitle = item.title.length > 14 ? item.title.slice(0, 14) + '...' : item.title;

    return (
      <View style={{
        backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON,
        borderRadius: 10,
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 10,
        width: itemWidth,
        height: 120,
        marginHorizontal: screenWidth * -0.06,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderColor: colorScheme === 'light' ? 'transparent' : themeBorderColor,
        borderWidth: 1,
      }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: screenWidth * 0.15,
            height: screenWidth * 0.15,
            borderRadius: 50,
            marginTop: screenHeight * 0.015,
            borderWidth: 1,
            borderColor: Colors.WHITE,
          }}
        />
        <View style={{
          flex: 1,
          marginLeft: 10,
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            color: Colors.WHITE,
          }}>{truncatedTitle}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
            <MaterialIcons
              name="category"
              size={14}
              color={themeIconColor}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontSize: 14,
              color: themeIconColor,
              fontFamily: 'Poppins',
            }}>{item.category}</Text>
          </View>
        </View>
        <Progress.Circle
          size={50}
          progress={item.progress}
          showsText
          formatText={() => `${Math.round(item.progress * 100)}%`}
          color={Colors.WHITE}
          style={{
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeBackgroundColor }}>
      <View style={{ zIndex: 1000 }}>
        <Header />
      </View>
      <ScrollView nestedScrollEnabled={true}>
        <View style={{ paddingHorizontal: 15, marginVertical: 15 }}>
          <GreetingCard />
        </View>
        <View>
          {loading ? (
            <View>
              <HomeScreenSkeleton />
            </View>
          ) : enrolledCourses.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: 20,
                backgroundColor: themeCardBackgroundColor,
                borderRadius: 10,
                marginHorizontal: 15,
                marginVertical: 5,
                marginBottom: 20,
                borderColor: themeBorderColor,
                borderWidth: 1,
              }}
            >
              <FontAwesome6
                name="bars-progress"
                size={50}
                color={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE}
                style={{ marginBottom: 15 }}
              />
              <Text
                style={{
                  fontSize: screenWidth * 0.04,
                  fontFamily: 'Poppins-Medium',
                  color: themeTextColor,
                  textAlign: 'center',
                }}
              >
                You are not enrolled in any courses yet.
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  backgroundColor: themeButtonBackgroundColor,
                  borderRadius: 25,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colorScheme === 'light' ? 'transparent' : themeBorderColor,
                }}
                onPress={() => navigation.navigate('Courses')}
              >
                <Text
                  style={{
                    color: themeButtonTextColor,
                    fontFamily: 'Poppins-Medium',
                    fontSize: screenWidth * 0.035,
                    marginRight: 10,
                  }}
                >
                  Explore Courses
                </Text>
                <Feather name="chevron-right" size={18} color={themeButtonTextColor} />
              </TouchableOpacity>
            </View>
          ) : (
            <Carousel
              data={enrolledCourses}
              renderItem={renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              inactiveSlideScale={0.9}
              inactiveSlideOpacity={0.7}
            />
          )}
          <TouchableOpacity
            style={{
              marginTop: 0,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colorScheme === 'light' ? 'transparent' : themeBorderColor,
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '40%',
              alignSelf: 'center',
              backgroundColor: themeButtonBackgroundColor,
              flexDirection: 'row',
            }}
            onPress={() => navigation.navigate('EnrolledCourses')}
          >
            <Text
              style={{
                color: themeButtonTextColor,
                fontSize: screenWidth * 0.029,
                fontFamily: 'Poppins-Medium',
              }}
            >
              Enrolled Courses
            </Text>
            <Feather
              name="chevron-right"
              size={14}
              color={themeButtonTextColor}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <StatsCard />
        </View>
        <StudyTracker />
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: screenWidth * 0.045,
              marginBottom: 10,
              fontFamily: 'Poppins-Medium',
              color: themeTextColor,
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            Recommended for you
          </Text>
          <RecommendedCoursesCarousel />
          <TouchableOpacity
            style={{
              marginTop: 20,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colorScheme === 'light' ? 'transparent' : themeBorderColor,
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '40%',
              alignSelf: 'center',
              backgroundColor: themeButtonBackgroundColor,
              flexDirection: 'row',
            }}
            onPress={() => navigation.navigate('Courses')}
          >
            <Text
              style={{
                color: themeButtonTextColor,
                fontSize: screenWidth * 0.029,
                fontFamily: 'Poppins-Medium',
              }}
            >
              View More
            </Text>
            <Feather
              name="chevron-right"
              size={14}
              color={themeButtonTextColor}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}