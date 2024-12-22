import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import DefaultAvatar from '../../../assets/Images/defaultAvatar.jpg'; // Import a default avatar image

const { width: screenWidth } = Dimensions.get('window');

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
  const translateY = useRef(new Animated.Value(0)).current; // Start at visible position
  const opacity = useRef(new Animated.Value(1)).current; // Start fully visible

  useEffect(() => {
    const fetchProfileAvatar = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
          if (userDoc.exists()) {
            setProfileAvatar(userDoc.data().avatar);
          }
        }
      } catch (error) {
        console.error("Error fetching profile avatar:", error);
      }
    };

    fetchProfileAvatar();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), where('unread', '==', true));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Snapshot size:", snapshot.size); // Debugging log
            setNotificationCount(snapshot.size);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

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

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="menu" size={30} color={Colors.SECONDARY} />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholderTextColor="#888"
          onChangeText={(text) => {
            setIsTyping(text.length > 0); // Set typing state based on input
          }}
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
            <Text style={styles.placeholderText}>
              {placeholderText}
            </Text>
          </Animated.View>
        )}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={30} color={Colors.SECONDARY} />
          {notificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
        <Image
          source={profileAvatar ? { uri: profileAvatar } : DefaultAvatar}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginTop: 40,
    width: '100%', // Ensure header doesn't overflow
    justifyContent: 'space-between', // Space between header elements
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 30,
    marginLeft: 15,
    width: screenWidth * 0.55,
    height: 40,
    position: 'relative',
    overflow: 'hidden', // Hide overflow
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 20, // Adjust padding to accommodate the icon
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.03,
  },
  placeholderOverlay: {
    position: 'absolute',
    left: 50, // Align with search icon
    top: 0,
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  placeholderText: {
    color: '#888',
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
    borderRadius: screenWidth * 0.1 / 2, // Maintain circular shape
    resizeMode: 'cover', // Ensure the image covers the view without stretching
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});