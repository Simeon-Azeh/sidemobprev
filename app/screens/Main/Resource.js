import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import Header from '../../components/General/Header';
import ResourceCategoryCarousel from '../../components/Resources/ResourceCategoryCarousel';
import RecommendedResources from '../../components/Resources/RecommendedResources';
import VideoCard from '../../components/Resources/VideoCard';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColorScheme } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

const fetchResources = async (type, level) => {
  const db = getFirestore();
  const levelFolder = level?.toLowerCase() === 'alevel' ? 'Alevel' : 'Olevel';
  const q = query(collection(db, `questions/${levelFolder}/documents`), where('type', '==', type));
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

const fetchVideos = async () => {
  const db = getFirestore();
  const q = query(collection(db, 'solutions'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
  const [selectedLevel, setSelectedLevel] = useState('Alevel');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await fetchResources('questions', selectedLevel);
        setQuestions(data);
        setFilteredQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [selectedLevel]); // Re-fetch when level changes

  const LevelSelector = () => (
    <View style={styles.levelSelector}>
      <TouchableOpacity
        style={[
          styles.levelButton,
          {
            backgroundColor: selectedLevel === 'Alevel' 
              ? Colors.PRIMARY 
              : colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY,
          },
        ]}
        onPress={() => setSelectedLevel('Alevel')}
      >
        <Text 
          style={[
            styles.levelButtonText, 
            {
              color: selectedLevel === 'Alevel' 
                ? '#fff' 
                : colorScheme === 'light' ? Colors.SECONDARY : '#fff'
            }
          ]}
        >
          A Level
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.levelButton,
          {
            backgroundColor: selectedLevel === 'Olevel' 
              ? Colors.PRIMARY 
              : colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY,
          },
        ]}
        onPress={() => setSelectedLevel('Olevel')}
      >
        <Text 
          style={[
            styles.levelButtonText,
            {
              color: selectedLevel === 'Olevel' 
                ? '#fff' 
                : colorScheme === 'light' ? Colors.SECONDARY : '#fff'
            }
          ]}
        >
          O Level
        </Text>
      </TouchableOpacity>
    </View>
  );

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
    navigation.navigate('ResourceDocs', {
      images: item.images, // Array of {pageNo, url}
      title: item.title,
      exam: item.exam,
      year: item.year,
      level: item.level,
      totalPages: item.totalPages,
      paper: item.paper
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchResources('questions', selectedLevel);
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
        <LevelSelector />
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
        {recommendedQuestions.length > 0 && (
          <RecommendedResources resources={recommendedQuestions} />
        )}
      </ScrollView>
      {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loadingIndicator} />}
    </View>
  );
};

const SolutionsTab = () => {
  const [solutions, setSolutions] = useState([]);
  const [filteredSolutions, setFilteredSolutions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Get the current color scheme

  useEffect(() => {
    const fetchSolutions = async () => {
      const data = await fetchResources('solutions', 'Alevel');
      const dataOlevel = await fetchResources('solutions', 'Olevel');
      setSolutions([...data, ...dataOlevel]);
      setFilteredSolutions([...data, ...dataOlevel]);
    };
    fetchSolutions();
  }, []);

  useEffect(() => {
    const fetchVideoData = async () => {
      const data = await fetchVideos();
      setVideos(data);
    };
    fetchVideoData();
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

  const handleVideoPress = (videoUrl) => {
    // Handle video press, e.g., navigate to a video player screen
    console.log('Video URL:', videoUrl);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchResources('solutions', 'Alevel');
    const dataOlevel = await fetchResources('solutions', 'Olevel');
    setSolutions([...data, ...dataOlevel]);
    setFilteredSolutions([...data, ...dataOlevel]);
    const videoData = await fetchVideos();
    setVideos(videoData);
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
       
        <View style={styles.videoGrid}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              description={video.description}
              thumbnail={video.thumbnail}
              videoUrl={video.videoUrl}
              year={video.year}
              level={video.level}
              duration={video.duration}
              onPress={() => handleVideoPress(video.videoUrl)}
            />
          ))}
        </View>
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
  levelSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  levelButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  levelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
    videoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginTop: 20,
    },
 
});