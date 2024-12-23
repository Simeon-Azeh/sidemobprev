import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
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

  useEffect(() => {
    const fetchCourses = async () => {
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
    };

    fetchCourses();
  }, []);

  const AllTab = () => (
    <ScrollView>
      <CategoryCoursesCarousel title="All Courses" courses={courses.all} />
    </ScrollView>
  );

  const ScienceTab = () => (
    <CategoryCoursesCarousel title="Science" courses={courses.science} />
  );

  const ArtsTab = () => (
    <CategoryCoursesCarousel title="Arts" courses={courses.arts} />
  );

  const TechTab = () => (
    <CategoryCoursesCarousel title="Tech" courses={courses.tech} />
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