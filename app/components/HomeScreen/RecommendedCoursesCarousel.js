import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import NoRecommendedCourses from './NoRecommendedCourses';

const { width: screenWidth } = Dimensions.get('window');

const sliderWidth = screenWidth;
const itemWidth = screenWidth * 0.6;

const renderItem = ({ item }) => {
  return (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      padding: 10,
      width: itemWidth,
      height: screenWidth * 0.7,
      marginHorizontal: screenWidth * -0.16,
    }}>
      <Image
        source={{ uri: item.image }}
        style={{
          width: screenWidth * 0.56,
          height: screenWidth * 0.35,
          borderRadius: 8,
        }}
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: screenWidth * 0.035, fontFamily: 'Poppins-Medium', color: Colors.SECONDARY }}>{item.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="school" size={20} color="#9835ff" />
          <Text style={{ marginLeft: 5, fontSize: 14, color: '#9835ff', fontFamily: 'Poppins-Medium' }}>{item.level}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialCommunityIcons name="timelapse" size={18} color="#a9a9a9" />
          <Text style={{ fontSize: 14, color: '#a9a9a9', marginLeft: 2, fontFamily: 'Poppins-Medium' }}> {item.timeToComplete}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <MaterialIcons name="star" size={20} color="#f1c40f" />
          <Text style={{ marginLeft: 5, fontSize: 14, color: '#a9a9a9', fontFamily: 'Poppins' }}>{item.ratings.toFixed(1)} ({item.reviews} reviews)</Text>
        </View>
      </View>
    </View>
  );
};

const RecommendedCoursesCarousel = () => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const savedCoursesRef = collection(db, 'SavedCourses');
          const enrolledCoursesRef = collection(db, 'Enrollments');

          const savedCoursesQuery = query(savedCoursesRef, where('userId', '==', user.uid));
          const enrolledCoursesQuery = query(enrolledCoursesRef, where('userId', '==', user.uid));

          const savedCoursesSnapshot = await getDocs(savedCoursesQuery);
          const enrolledCoursesSnapshot = await getDocs(enrolledCoursesQuery);

          const categories = new Set();

          savedCoursesSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.category) {
              categories.add(data.category);
            }
          });

          enrolledCoursesSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.category) {
              categories.add(data.category);
            }
          });

          console.log('Collected categories:', Array.from(categories));

          const allCoursesRef = collection(db, 'courses');
          const allCoursesSnapshot = await getDocs(allCoursesRef);
          const allCourses = allCoursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const filteredCourses = allCourses.filter(course => categories.has(course.category));
          console.log('Filtered courses:', filteredCourses);

          const shuffledCourses = filteredCourses.sort(() => 0.5 - Math.random());
          const selectedCourses = shuffledCourses.slice(0, 4);

          setRecommendedCourses(selectedCourses);
        }
      } catch (error) {
        console.error("Error fetching recommended courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, []);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        recommendedCourses.length > 0 ? (
          <Carousel
            data={recommendedCourses}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            inactiveSlideScale={0.9}
            inactiveSlideOpacity={0.7}
            contentContainerCustomStyle={{ overflow: 'visible' }}
          />
        ) : (
          <NoRecommendedCourses />

        )
      )}
    </View>
  );
};

export default RecommendedCoursesCarousel;