import React from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Header from '../../components/General/Header';
import TutorCategoryCarousel from '../../components/Tutors/TutorCategoryCarousel';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colors from '../../../assets/Utils/Colors';

const { width } = Dimensions.get('window');

const sampleTutors = {
  all: [
    {
      name: 'Akong John',
      image: 'https://img.freepik.com/free-photo/young-successful-african-businessman-posing-dark_176420-4970.jpg?t=st=1723280947~exp=1723284547~hmac=ed4ec68d81c32d80afc528d01a61e16691a948dd812780977aef3e78077ffae8&w=740',
      subjects: ['Mathematics', 'Physics'],
      ratings: 4.8,
      reviews: 150,
      level: 'Alevel',
      verified: true,
    },
    {
      name: 'Jane Smith',
      image: 'https://img.freepik.com/free-photo/black-woman-standing-autumn-city_1157-18895.jpg?t=st=1723281567~exp=1723285167~hmac=2316d77c4dfe9e00c59934f72045cc168ced513130e7496a4f7dbf721a66a39e&w=740',
      subjects: ['Biology', 'Chemistry'],
      ratings: 4.5,
      reviews: 120,
      level: 'Olevel',
      verified: false,
    },
    {
      name: 'Alex Johnson',
      image: 'https://img.freepik.com/free-photo/portrait-black-young-man-wearing-african-traditional-red-colorful-clothes_627829-4909.jpg?t=st=1723281517~exp=1723285117~hmac=6d6d8984cb55c6022c3e202901eaeed444ec8265712f9c8d3fa2af70c49c79a1&w=740',
      subjects: ['English', 'History'],
      ratings: 4.7,
      reviews: 95,
      level: 'Alevel | Olevel',
      verified: true,
    },
  ],
  science: [
    {
      name: 'Emily Davis',
      image: 'https://img.freepik.com/free-photo/smiley-teacher-classroom_23-2151696450.jpg?t=st=1723281698~exp=1723285298~hmac=93a367f339c9a31781fcfeec7e770304a05782481162a16b97f47aab64c3064c&w=826',
      subjects: ['Physics', 'Chemistry'],
      ratings: 4.9,
      reviews: 200,
      level: 'Alevel',
      verified: true,
    },
    {
      name: 'Jane Smith',
      image: 'https://img.freepik.com/free-photo/black-woman-standing-autumn-city_1157-18895.jpg?t=st=1723281567~exp=1723285167~hmac=2316d77c4dfe9e00c59934f72045cc168ced513130e7496a4f7dbf721a66a39e&w=740',
      subjects: ['Biology', 'Chemistry'],
      ratings: 4.5,
      reviews: 120,
      level: 'Olevel',
      verified: false,
    },
  ],
  arts: [
    {
      name: 'Michael Brown',
      image: 'https://img.freepik.com/free-photo/young-african-male-with-glasses-wearing-black-t-shirt-backpack-street_181624-34924.jpg?t=st=1723281479~exp=1723285079~hmac=16a22f561628e194c3bde354a4dde34dd0d544a78b3d21704ed6d49f45a51d1e&w=740',
      subjects: ['Art History', 'Literature'],
      ratings: 4.6,
      reviews: 80,
      level: 'Olevel',
      verified: true,
    },
    {
      name: 'Alex Johnson',
      image: 'https://img.freepik.com/free-photo/portrait-black-young-man-wearing-african-traditional-red-colorful-clothes_627829-4909.jpg?t=st=1723281517~exp=1723285117~hmac=6d6d8984cb55c6022c3e202901eaeed444ec8265712f9c8d3fa2af70c49c79a1&w=740',
      subjects: ['English', 'History'],
      ratings: 4.7,
      reviews: 95,
      level: 'Alevel | Olevel',
      verified: true,
    },
  ],
  tech: [
    {
      name: 'Sarah Wilson',
      image: 'https://img.freepik.com/free-photo/group-afro-americans-working-together_1303-8978.jpg?t=st=1723281408~exp=1723285008~hmac=544c6e5c50188942a14b62e2037b817db1b460c76692041a8ed1413cab20d0fe&w=740',
      subjects: ['Web Development', 'Computer Science'],
      ratings: 4.9,
      reviews: 180,
      level: 'Alevel | Olevel',
      verified: true,
    },
  ],
  favorites : [
    {
      name: 'Sarah Wilson',
      image: 'https://img.freepik.com/free-photo/group-afro-americans-working-together_1303-8978.jpg?t=st=1723281408~exp=1723285008~hmac=544c6e5c50188942a14b62e2037b817db1b460c76692041a8ed1413cab20d0fe&w=740',
      subjects: ['Web Development', 'Computer Science'],
      ratings: 4.9,
      reviews: 180,
      level: 'Alevel | Olevel',
      verified: true,
    },
  ]
};


const AllTab = () => (
  <ScrollView>
  
    <TutorCategoryCarousel title="Science" tutors={sampleTutors.science} />
    <TutorCategoryCarousel title="Arts" tutors={sampleTutors.arts} />
    <TutorCategoryCarousel title="Tech" tutors={sampleTutors.tech} />
    <TutorCategoryCarousel title="Favorites" tutors={sampleTutors.favorites} />
  </ScrollView>
);

const ScienceTab = () => (
  <TutorCategoryCarousel title="Science" tutors={sampleTutors.science} />
);

const ArtsTab = () => (
  <TutorCategoryCarousel title="Arts" tutors={sampleTutors.arts} />
);

const TechTab = () => (
  <TutorCategoryCarousel title="Tech" tutors={sampleTutors.tech} />
);
const FavoriteTab = () => (
  <TutorCategoryCarousel title="Favorites" tutors={sampleTutors.favorites} />
);

const renderScene = SceneMap({

  science: ScienceTab,
  arts: ArtsTab,
  tech: TechTab,
  all: AllTab,
  favorites: FavoriteTab,
});

export default function TutorsScreen() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
   
    { key: 'science', title: 'Science' },
    { key: 'arts', title: 'Arts' },
    { key: 'tech', title: 'Tech' },
    { key: 'favorites', title: 'Favorites' },
   
  ]);

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
