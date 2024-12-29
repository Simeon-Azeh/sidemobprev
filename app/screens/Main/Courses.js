import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../../components/General/Header';
import CategoryCoursesCarousel from '../../components/Courses/CourseCategoryCarousel';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const CoursesScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'science', title: 'Science' },
    { key: 'arts', title: 'Arts' },
    { key: 'tech', title: 'Tech' },
  ]);
  const [courses, setCourses] = useState({
    science: [],
    arts: [],
    tech: [],
  });
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const db = getFirestore();
      const coursesRef = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesRef);
      const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const categorizedCourses = {
        science: [],
        arts: [],
        tech: [],
      };

      coursesList.forEach(course => {
        if (course.category === 'science') categorizedCourses.science.push(course);
        if (course.category === 'arts') categorizedCourses.arts.push(course);
        if (course.category === 'tech') categorizedCourses.tech.push(course);
      });

      setCourses(categorizedCourses);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const ScienceTab = () => (
    <ScrollView style={{ backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }}>
      {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <CategoryCoursesCarousel title="Science" courses={courses.science} />}
    </ScrollView>
  );

  const ArtsTab = () => (
    <ScrollView style={{ backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }}>
      {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <CategoryCoursesCarousel title="Arts" courses={courses.arts} />}
    </ScrollView>
  );

  const TechTab = () => (
    <ScrollView style={{ backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }}>
      {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <CategoryCoursesCarousel title="Tech" courses={courses.tech} />}
    </ScrollView>
  );

  const renderScene = SceneMap({
    science: ScienceTab,
    arts: ArtsTab,
    tech: TechTab,
  });

  return (
    <View style={{ flex: 1, backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }}>
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
            indicatorStyle={{ backgroundColor: colorScheme === 'light' ? '#9835FF' : '#fff', height: 2.5 }}
            style={{ backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_HEADER }}
            labelStyle={{ color: colorScheme === 'light' ? Colors.SECONDARY : '#fff', fontFamily: 'Poppins-Medium' }}
            activeColor={colorScheme === 'light' ? '#9835FF' : '#fff'}
            inactiveColor={colorScheme === 'light' ? 'gray' : Colors.DARK_TEXT_MUTED}
            pressColor={colorScheme === 'light' ? '#f9feff' : Colors.DARK_BUTTON}
          />
        )}
      />
    </View>
  );
};

export default CoursesScreen;