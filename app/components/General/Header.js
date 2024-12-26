import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Text, Animated, FlatList, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import DefaultAvatar from '../../../assets/Images/defaultAvatar.jpg'; // Import a default avatar image
import { onAuthStateChanged } from 'firebase/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const placeholders = [
  'Find Courses',
  'Find Tutors',
  'Find Questions',
  'Find Solutions',
];

export default function Header() {
  const navigation = useNavigation();
  const [placeholderText, setPlaceholderText] = useState(placeholders[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const translateY = useRef(new Animated.Value(0)).current; // Start at visible position
  const opacity = useRef(new Animated.Value(1)).current; // Start fully visible

  const colorScheme = useColorScheme();

  const themeBackgroundColor = colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BACKGROUND;
  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themePlaceholderTextColor = colorScheme === 'light' ? '#888' : Colors.DARK_TEXT_MUTED;
  const themeIconColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeSearchBackgroundColor = colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY;
  const themeBadgeBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;
  const themeBadgeTextColor = colorScheme === 'light' ? '#fff' : '#000';
  const themeBorderColor = colorScheme === 'light' ? Colors.LIGHT_GRAY : Colors.DARK_TEXT;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfileAvatar(user.uid);
        fetchNotifications(user.uid);
      } else {
        setProfileAvatar(null);
        setNotificationCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfileAvatar = async (userId) => {
    try {
      const userDoc = await getDoc(doc(getFirestore(), 'users', userId));
      if (userDoc.exists()) {
        setProfileAvatar(userDoc.data().avatar);
      }
    } catch (error) {
      console.error("Error fetching profile avatar:", error);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const db = getFirestore();
      const q = query(collection(db, 'notifications'), where('userId', '==', userId), where('unread', '==', true));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotificationCount(snapshot.size);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (!isTyping) {
      const interval = setInterval(() => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0, // Fade out
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 20, // Slide down
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(translateY, {
            toValue: -20, // Reset position for new text
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1, // Fade in
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0, // Slide back to visible position
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        setPlaceholderText(prev => {
          const currentIndex = placeholders.indexOf(prev);
          const nextIndex = (currentIndex + 1) % placeholders.length;
          return placeholders[nextIndex];
        });
      }, 4000);

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [isTyping, translateY, opacity]);

  const handleSearch = async (text) => {
    setIsTyping(text.length > 0);
    if (text.length > 0) {
      const db = getFirestore();
      const tutorsQuery = query(collection(db, 'tutors'), where('name', '>=', text), where('name', '<=', text + '\uf8ff'));
      const coursesQuery = query(collection(db, 'courses'), where('title', '>=', text), where('title', '<=', text + '\uf8ff'));
      const questionsQuery = query(collection(db, 'questions'), where('title', '>=', text), where('title', '<=', text + '\uf8ff'));
      const solutionsQuery = query(collection(db, 'solutions'), where('name', '>=', text), where('name', '<=', text + '\uf8ff'));

      const [tutorsSnapshot, coursesSnapshot, questionsSnapshot, solutionsSnapshot] = await Promise.all([
        getDocs(tutorsQuery),
        getDocs(coursesQuery),
        getDocs(questionsQuery),
        getDocs(solutionsQuery),
      ]);

      const tutors = tutorsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'Tutor' }));
      const courses = coursesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'Course' }));
      const questions = questionsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'Question' }));
      const solutions = solutionsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'Solution' }));

      setSearchResults([...tutors, ...courses, ...questions, ...solutions]);
    } else {
      setSearchResults([]);
    }
  };

  const renderSearchResult = ({ item }) => (
    <View style={styles.searchResultItem}>
      {item.type === 'Tutor' && (
        <Image
          source={item.avatar ? { uri: item.avatar } : DefaultAvatar}
          style={styles.resultImage}
        />
      )}
      {item.type === 'Course' && (
        <Image
          source={{ uri: item.image }}
          style={styles.resultImage}
        />
      )}
      <View style={styles.resultTextContainer}>
        <Text style={styles.searchResultText}>{item.name || item.title}</Text>
        <Text style={styles.searchResultType}>{item.type}</Text>
      </View>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => {
          setIsTyping(false);
          setSearchResults([]);
          if (item.type === 'Tutor') {
            navigation.navigate('TutorDetails', { tutorId: item.id });
          } else if (item.type === 'Course') {
            navigation.navigate('CourseDetails', { courseId: item.id });
          } else if (item.type === 'Question') {
            navigation.navigate('QuestionDetails', { questionId: item.id });
          } else if (item.type === 'Solution') {
            navigation.navigate('SolutionDetails', { solutionId: item.id });
          }
        }}
      >
        <Text style={styles.exploreButtonText}>Explore {item.type}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.headerContainer, { backgroundColor: themeBackgroundColor, borderBottomColor: themeBorderColor }]}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="menu" size={30} color={themeIconColor} />
      </TouchableOpacity>
      <View style={[styles.searchContainer, { backgroundColor: themeSearchBackgroundColor }]}>
        <Icon name="search" size={20} color={themePlaceholderTextColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: themeTextColor }]}
          placeholderTextColor={themePlaceholderTextColor}
          onChangeText={handleSearch}
          onBlur={() => setIsTyping(false)} // Clear typing state when input loses focus
        />
        {!isTyping && (
          <Animated.View
            style={[
              styles.placeholderOverlay,
              {
                opacity: opacity,
                transform: [{ translateY }],
                pointerEvents: 'none', // Make sure this view doesn't block touch events
              },
            ]}
          >
            <Text style={[styles.placeholderText, { color: themePlaceholderTextColor }]}>
              {placeholderText}
            </Text>
          </Animated.View>
        )}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={30} color={themeIconColor} />
          {notificationCount > 0 && (
            <View style={[styles.badgeContainer, { backgroundColor: themeBadgeBackgroundColor }]}>
              <Text style={[styles.badgeText, { color: themeBadgeTextColor }]}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
        <Image
          source={profileAvatar ? { uri: profileAvatar } : DefaultAvatar}
          style={[styles.profileImage, { borderColor: themeBorderColor }]}
        />
      </TouchableOpacity>
      {isTyping && (
        <Animated.View style={styles.searchOverlay}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderSearchResult}
            ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 40,
    width: '100%', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, // Add bottom border
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 30,
    marginLeft: 15,
    width: screenWidth * 0.55,
    height: 40,
    position: 'relative',
    overflow: 'hidden', 
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 20, 
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.03,
  },
  placeholderOverlay: {
    position: 'absolute',
    left: 50, 
    top: 0,
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  placeholderText: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.03,
  },
  iconContainer: {
    marginLeft: 15,
    width: screenWidth * 0.11, // Smaller width to avoid overflow
    height: screenWidth * 0.11, // Maintain square aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Needed for badge positioning
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: screenWidth * 0.11 / 2, // Maintain circular shape
    resizeMode: 'cover', // Ensure the image covers the view without stretching
    borderWidth: 2, // Add border around profile image
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  searchOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f9feff',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.8, // Ensure overlay covers the entire screen
  },
  searchResultItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: screenWidth * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  resultTextContainer: {
    flex: 1,
  },
  searchResultText: {
    fontSize: 16,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
  searchResultType: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins',
  },
  exploreButton: {
    marginTop: 10,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  noResultsText: {
    color: '#444',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
  },
});