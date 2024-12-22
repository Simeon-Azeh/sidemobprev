import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons or any other icon set you prefer
import * as Progress from 'react-native-progress'; // Import the progress circle component
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'; // Skeleton Loader
import Header from '../../components/General/Header';
import GreetingCard from '../../components/General/GreetingCard';
import Colors from '../../../assets/Utils/Colors';
import StatsCard from '../../components/HomeScreen/StatsCard';
import StudyTracker from '../../components/HomeScreen/StudyTracker';

import RecommendedCoursesCarousel from '../../components/HomeScreen/RecommendedCoursesCarousel';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import HomeScreenSkeleton from '../../components/HomeScreenSkeleton';

export default function HomeScreen() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const navigation = useNavigation();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderWidth = screenWidth;
  const itemWidth = screenWidth * 0.8; // Adjust item width as needed

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(getFirestore(), 'enrolledCourses'), where('email', '==', user.email));
          const querySnapshot = await getDocs(q);
          const courses = [];
          querySnapshot.forEach((doc) => {
            courses.push(doc.data());
          });
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
    return (
      <View style={{
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 10,
        width: itemWidth,
        height: 120,
        marginHorizontal: screenWidth * -0.06, // Spacing between items
        paddingHorizontal: 20,
        marginBottom: 20,
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
          }}>{item.title}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
            <MaterialIcons
              name="category"
              size={14}
              color={Colors.LIGHT_GRAY}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontSize: 14,
              color: Colors.LIGHT_GRAY,
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
    <View style={{ flex: 1 }}>
      <Header />
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
                backgroundColor: Colors.LIGHT_GRAY,
                borderRadius: 10,
                marginHorizontal: 15,
                marginVertical: 5,
                marginBottom: 20,
              }}
            >
              <FontAwesome6
                name="bars-progress"
                size={50}
                color={Colors.PRIMARY}
                style={{ marginBottom: 15 }}
              />
              <Text
                style={{
                  fontSize: screenWidth * 0.04,
                  fontFamily: 'Poppins-Medium',
                  color: Colors.SECONDARY,
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
                  backgroundColor: Colors.PRIMARY,
                  borderRadius: 25,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('Courses')}
              >
                <Text
                  style={{
                    color: Colors.WHITE,
                    fontFamily: 'Poppins-Medium',
                    fontSize: screenWidth * 0.035,
                    marginRight: 10,
                  }}
                >
                  Explore Courses
                </Text>
                <Feather name="chevron-right" size={18} color={Colors.WHITE} />
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
              borderColor: Colors.PRIMARY,
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '40%',
              alignSelf: 'center',
              backgroundColor: Colors.WHITE,
              flexDirection: 'row',
            }}
            onPress={() => navigation.navigate('EnrolledCourses')}
          >
            <Text
              style={{
                color: Colors.PRIMARY,
                fontSize: screenWidth * 0.029,
                fontFamily: 'Poppins-Medium',
              }}
            >
              Enrolled Courses
            </Text>
            <Feather
              name="chevron-right"
              size={14}
              color={Colors.PRIMARY}
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
              color: Colors.SECONDARY,
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
              borderColor: Colors.PRIMARY,
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '40%',
              alignSelf: 'center',
              backgroundColor: Colors.WHITE,
            }}
            onPress={() => navigation.navigate('Courses')}
          >
            <Text
              style={{
                color: Colors.PRIMARY,
                fontSize: screenWidth * 0.029,
                fontFamily: 'Poppins-Medium',
              }}
            >
              View More
            </Text>
            <Feather
              name="chevron-right"
              size={14}
              color={Colors.PRIMARY}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}