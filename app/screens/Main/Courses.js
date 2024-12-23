import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../../components/General/Header';
import CategoryCoursesCarousel from '../../components/Courses/CourseCategoryCarousel';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const CoursesScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'science', title: 'Science' },
    { key: 'arts', title: 'Arts' },
    { key: 'tech', title: 'Tech' },
  ]);
  const [courses, setCourses] = useState({
    all: [],
    science: [],
    arts: [],
    tech: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const db = getFirestore();
      const coursesRef = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesRef);
      const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const categorizedCourses = {
        all: [],
        science: [],
        arts: [],
        tech: [],
      };

      coursesList.forEach(course => {
        categorizedCourses.all.push(course);
        if (course.category === 'science') categorizedCourses.science.push(course);
        if (course.category === 'arts') categorizedCourses.arts.push(course);
        if (course.category === 'tech') categorizedCourses.tech.push(course);
      });

      setCourses(categorizedCourses);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const AllTab = () => (
    <ScrollView>
      {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <CategoryCoursesCarousel title="All Courses" courses={courses.all} />}
    </ScrollView>
  );

  const ScienceTab = () => (
    <ScrollView>
      {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <CategoryCoursesCarousel title="Science" courses={courses.science} />}
    </ScrollView>
  );

  const ArtsTab = () => (
    <ScrollView>
      {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <CategoryCoursesCarousel title="Arts" courses={courses.arts} />}
    </ScrollView>
  );

  const TechTab = () => (
    <ScrollView>
      {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <CategoryCoursesCarousel title="Tech" courses={courses.tech} />}
    </ScrollView>
  );

  const renderScene = SceneMap({
    all: AllTab,
    science: ScienceTab,
    arts: ArtsTab,
    tech: TechTab,
  });

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        style={{ marginTop: 0 }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#9835FF', height: 2.5 }}
            style={{ backgroundColor: '#fff' }}
            labelStyle={{ color: Colors.SECONDARY, fontFamily: 'Poppins-Medium' }}
            activeColor="#9835FF"
            inactiveColor="gray"
            pressColor="#f9feff"
          />
        )}
      />
    </View>
  );
};

export default CoursesScreen;