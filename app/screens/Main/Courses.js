import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../../components/General/Header';
import CategoryCoursesCarousel from '../../components/Courses/CourseCategoryCarousel';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions, Text } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width } = Dimensions.get('window');

const sampleCourses = {
  all: [
    {
      title: 'React Native for Beginners',
      level: 'Advanced',
      image: 'https://img.freepik.com/free-vector/background-abstract-pixel-rain_23-2148371445.jpg?t=st=1723064746~exp=1723068346~hmac=df13cd47dd1ce96ead73617380abffe705eda61371f6f28987f2d25984296a51&w=740',
      timeToComplete: '10 hours',
      ratings: 4.5,
      reviews: 120,
    },
    {
      title: 'Computer Science',
      level: 'Olevel',
      image: 'https://img.freepik.com/free-vector/gradient-top-view-laptop-background_52683-6291.jpg?t=st=1723065545~exp=1723069145~hmac=961c9dd607942a47415ea68a2f399920924699baf5f127abf2fe969091fcf2cc&w=740',
      timeToComplete: '20 hours',
      ratings: 4.7,
      reviews: 98,
    },
    {
      title: 'Flutter for Beginners',
      level: 'Alevel',
      image: 'https://img.freepik.com/free-photo/representations-user-experience-interface-design_23-2150104485.jpg?t=st=1723065936~exp=1723069536~hmac=3efbbbdecb111701557d4631157f58a39ff330892ed93f069213c6701b3df930&w=740',
      timeToComplete: '15 hours',
      ratings: 4.3,
      reviews: 75,
    },
  ],
  science: [
    {
      title: 'Food Science',
      level: 'ALevel',
      image: 'https://img.freepik.com/free-photo/physics-formulas-abstract-technology-background_1150-20328.jpg',
      timeToComplete: '12 hours',
      ratings: 4.8,
      reviews: 130,
    },
    {
        title: 'Physics Fundamentals',
        level: 'ALevel',
        image: 'https://img.freepik.com/free-vector/realistic-science-background_23-2148494535.jpg?t=st=1723118418~exp=1723122018~hmac=99202b6fa2aba0d1f4bc6914abd3b6bd8b5933cac77b973af60050bb864d917d&w=740',
        timeToComplete: '12 hours',
        ratings: 4.8,
        reviews: 130,
      },
  ],
  arts: [
    {
      title: 'Cameroon History',
      level: 'Alevel',
      image: 'https://imgs.search.brave.com/_tz_xKjg-2Qkr20LqIN-UMRvb17lKlG7bgIgIuJEjLw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy85/LzkyL1lhb3VuZGVV/bml0eVBhbGFjZS5w/bmc',
      timeToComplete: '8 hours',
      ratings: 4.2,
      reviews: 60,
    },
  ],
  tech: [
    {
      title: 'Web Development Bootcamp',
      level: 'Alevel',
      image: 'https://img.freepik.com/free-photo/development-with-abstract-background_1134-414.jpg?t=st=1723118784~exp=1723122384~hmac=994ff5184ccd621665a2d4d21d177486e904123cb2491de259443e103f8c15b4&w=740',
      timeToComplete: '25 hours',
      ratings: 4.9,
      reviews: 200,
    },
    {
        title: 'Getting Started with Web 3.0',
        level: 'Alevel',
        image: 'https://img.freepik.com/free-vector/gradient-style-network-connection-background_23-2148876716.jpg?t=st=1723118842~exp=1723122442~hmac=6a9097e38cd085ccd83529afd92ece6dada7b2abd4d7a2d0dac79fcb0d02b17f&w=740',
        timeToComplete: '25 hours',
        ratings: 4.9,
        reviews: 200,
      },
  ],
};

const AllTab = () => (
  <ScrollView>
    <CategoryCoursesCarousel title="Freelance" courses={sampleCourses.all} />
    <CategoryCoursesCarousel title="Science" courses={sampleCourses.science} />
    <CategoryCoursesCarousel title="Arts" courses={sampleCourses.arts} />
    <CategoryCoursesCarousel title="Tech" courses={sampleCourses.tech} />
  </ScrollView>
);

const ScienceTab = () => (
  <CategoryCoursesCarousel title="Science" courses={sampleCourses.science} />
);

const ArtsTab = () => (
  <CategoryCoursesCarousel title="Arts" courses={sampleCourses.arts} />
);

const TechTab = () => (
  <CategoryCoursesCarousel title="Tech" courses={sampleCourses.tech} />
);

const renderScene = SceneMap({
  all: AllTab,
  science: ScienceTab,
  arts: ArtsTab,
  tech: TechTab,
});

export default function CoursesScreen() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'all', title: 'All' },
    { key: 'science', title: 'Science' },
    { key: 'arts', title: 'Arts' },
    { key: 'tech', title: 'Tech' },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        style={{ marginTop: 0,  }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#9835FF', height: 2.5 }}
            style={{ backgroundColor: '#fff' }}
            labelStyle={{ color: Colors.SECONDARY, fontFamily: 'Poppins-Medium' }}
            activeColor="#9835FF"
            inactiveColor="gray"
            pressColor="#f9feff"  // Set this to a lighter color
          />
        )}
      />
    </View>
  );
}
