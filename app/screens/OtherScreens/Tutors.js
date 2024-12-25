import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Header from '../../components/General/Header';
import TutorCategoryCarousel from '../../components/Tutors/TutorCategoryCarousel';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

const fetchTutors = async () => {
  const db = getFirestore();
  const tutorsCollection = collection(db, 'tutors');
  const tutorsSnapshot = await getDocs(tutorsCollection);
  const tutors = [];

  for (const tutorDoc of tutorsSnapshot.docs) {
    const tutorData = tutorDoc.data();
    const ratingsDoc = await getDoc(doc(db, 'teacherRatings', tutorDoc.id));
    const reviewsDoc = await getDoc(doc(db, 'teacherReviews', tutorDoc.id));
    const likesDoc = await getDoc(doc(db, 'teacherLikes', tutorDoc.id));

    tutors.push({
      id: tutorDoc.id, // Ensure tutorId is included
      ...tutorData,
      ratings: ratingsDoc.exists() ? ratingsDoc.data().averageRating : 0,
      reviews: reviewsDoc.exists() ? reviewsDoc.data().reviewCount : 0,
      likes: likesDoc.exists() ? likesDoc.data().likeCount : 0,
      likedBy: likesDoc.exists() ? likesDoc.data().likedBy : [],
    });
  }

  return tutors;
};
export default function TutorsScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'science', title: 'Science' },
    { key: 'arts', title: 'Arts' },
    { key: 'tech', title: 'Tech' },
    { key: 'favorites', title: 'Favorites' },
  ]);
  const [tutors, setTutors] = useState({
    science: [],
    arts: [],
    tech: [],
    favorites: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTutors = await fetchTutors();
      const auth = getAuth();
      const user = auth.currentUser;

      setTutors({
        science: fetchedTutors.filter(tutor => tutor.subjects.includes('Physics') || tutor.subjects.includes('Chemistry') || tutor.subjects.includes('Biology')),
        arts: fetchedTutors.filter(tutor => tutor.subjects.includes('Art History') || tutor.subjects.includes('Literature') || tutor.subjects.includes('History')),
        tech: fetchedTutors.filter(tutor => tutor.subjects.includes('Web Development') || tutor.subjects.includes('Computer Science')),
        favorites: fetchedTutors.filter(tutor => tutor.likedBy.includes(user.uid)),
      });
    };

    fetchData();
  }, []);

  const ScienceTab = () => (
    <TutorCategoryCarousel title="Science" tutors={tutors.science} />
  );

  const ArtsTab = () => (
    <TutorCategoryCarousel title="Arts" tutors={tutors.arts} />
  );

  const TechTab = () => (
    <TutorCategoryCarousel title="Tech" tutors={tutors.tech} />
  );

  const FavoriteTab = () => (
    <TutorCategoryCarousel title="Favorites" tutors={tutors.favorites} />
  );

  const renderScene = SceneMap({
    science: ScienceTab,
    arts: ArtsTab,
    tech: TechTab,
    favorites: FavoriteTab,
  });

  return (
    <View style={styles.container}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        style={styles.tabView}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.tabBarLabel}
            activeColor="#9835FF"
            inactiveColor="gray"
            pressColor="#f9feff"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    marginTop: 0,
  },
  tabBar: {
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#9835FF',
    height: 2.5,
  },
  tabBarLabel: {
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
});