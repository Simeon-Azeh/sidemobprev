import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, RefreshControl, TextInput, ActivityIndicator, Animated } from 'react-native';
import Header from '../../components/General/Header';
import ResourceCategoryCarousel from '../../components/Resources/ResourceCategoryCarousel';
import RecommendedResources from '../../components/Resources/RecommendedResources';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColorScheme } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

const fetchResources = async (type) => {
  const db = getFirestore();
  const q = query(collection(db, 'pdfDocuments'), where('type', '==', type));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchUserLevel = async (userId) => {
  const db = getFirestore();
  const userDoc = await getDocs(query(collection(db, 'users'), where('userId', '==', userId)));
  if (!userDoc.empty) {
    return userDoc.docs[0].data().level;
  }
  return null;
};

const fetchRecommendedResources = async (level) => {
  const db = getFirestore();
  const q = query(collection(db, 'pdfDocuments'), where('level', '==', level));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const NoRecommendedContent = ({ onSettingsPress }) => {
  const colorScheme = useColorScheme(); // Get the current color scheme
  const slideAnim = new Animated.Value(-100); // Initial value for slide animation

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.noRecommendedContent, { transform: [{ translateY: slideAnim }], backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
      <Icon name="info" size={40} color={colorScheme === 'light' ? Colors.PRIMARY : '#fff'} />
      <Text style={[styles.noRecommendedText, { color: colorScheme === 'light' ? Colors.SECONDARY : '#fff' }]}>
        We couldn't recommend you courses because we don't know what level you are. Please update your level in settings.
      </Text>
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]}
        onPress={onSettingsPress}
      >
        <Text style={[styles.submitButtonText, { color: colorScheme === 'light' ? '#fff' : '#000' }]}>Update in Settings</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuestionsTab = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Get the current color scheme

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await fetchResources('questions');
      setQuestions(data);
      setFilteredQuestions(data);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchUserAndRecommendedQuestions = async () => {
      const level = await fetchUserLevel(userId);
      if (level) {
        const data = await fetchRecommendedResources(level);
        setRecommendedQuestions(data);
      }
    };
    fetchUserAndRecommendedQuestions();
  }, [userId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = questions.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredQuestions(filteredData);
    } else {
      setFilteredQuestions(questions);
    }
  };

  const handleItemPress = async (item) => {
    const db = getFirestore();
    const docRef = doc(db, 'pdfDocuments', item.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fileURL = docSnap.data().fileURL;
      navigation.navigate('ResourceDocs', {
        fileURL,
        title: item.title,
        exam: item.exam,
        year: item.year,
        level: item.level,
      });
    } else {
      console.log('No such document!');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchResources('questions');
    setQuestions(data);
    setFilteredQuestions(data);
    const level = await fetchUserLevel(userId);
    if (level) {
      const recommendedData = await fetchRecommendedResources(level);
      setRecommendedQuestions(recommendedData);
    }
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
          <Icon name="search" size={20} color={colorScheme === 'light' ? '#000' : '#fff'} />
          <TextInput
            style={[styles.searchInput, { color: colorScheme === 'light' ? '#000' : '#fff' }]}
            placeholder="Search questions..."
            placeholderTextColor={colorScheme === 'light' ? '#999' : '#ccc'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <ResourceCategoryCarousel title="All Questions" data={filteredQuestions} onItemPress={handleItemPress} />
        {recommendedQuestions.length > 0 ? (
          <RecommendedResources resources={recommendedQuestions} />
        ) : (
          <NoRecommendedContent onSettingsPress={() => navigation.navigate('Settings')} />
        )}
      </ScrollView>
      {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loadingIndicator} />}
    </View>
  );
};

const SolutionsTab = () => {
  const [solutions, setSolutions] = useState([]);
  const [filteredSolutions, setFilteredSolutions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Get the current color scheme

  useEffect(() => {
    const fetchSolutions = async () => {
      const data = await fetchResources('solutions');
      setSolutions(data);
      setFilteredSolutions(data);
    };
    fetchSolutions();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = solutions.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSolutions(filteredData);
    } else {
      setFilteredSolutions(solutions);
    }
  };

  const handleItemPress = async (item) => {
    const db = getFirestore();
    const docRef = doc(db, 'pdfDocuments', item.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fileURL = docSnap.data().fileURL;
      navigation.navigate('ResourceDocs', {
        fileURL,
        title: item.title,
        exam: item.exam,
        year: item.year,
        level: item.level,
      });
    } else {
      console.log('No such document!');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchResources('solutions');
    setSolutions(data);
    setFilteredSolutions(data);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
          <Icon name="search" size={20} color={colorScheme === 'light' ? '#000' : '#fff'} />
          <TextInput
            style={[styles.searchInput, { color: colorScheme === 'light' ? '#000' : '#fff' }]}
            placeholder="Search solutions..."
            placeholderTextColor={colorScheme === 'light' ? '#999' : '#ccc'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <ResourceCategoryCarousel title="Popular Solutions" data={filteredSolutions} onItemPress={handleItemPress} />
      </ScrollView>
      {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loadingIndicator} />}
    </View>
  );
};

const renderScene = (userId) => SceneMap({
  questions: () => <QuestionsTab userId={userId} />,
  solutions: SolutionsTab,
});

export default function Resource() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'questions', title: 'Questions' },
    { key: 'solutions', title: 'Solutions' },
  ]);
  const colorScheme = useColorScheme(); // Get the current color scheme
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <View style={{ flex: 1, backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }}>
      <Header />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene(user ? user.uid : 'user123')}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        style={{ marginTop: 0 }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colorScheme === 'light' ? '#9835FF' : '#fff', height: 3 }}
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
}

const pickerStyles = StyleSheet.create({
  inputAndroid: {
    color: '#000',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  inputIOS: {
    color: '#000',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  placeholder: {
    color: '#999',
  },
});

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 70, // Space for floating button
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 10,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  noRecommendedContent: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  noRecommendedText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});