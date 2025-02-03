import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Profileavatar from '../../../assets/Images/avatar4.jpg';
import Colors from '../../../assets/Utils/Colors';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; // FontAwesome5
import { Ionicons } from '@expo/vector-icons'; // Ionicons
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, storage } from '../../../firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState(0);
  const [badges, setBadges] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [nextBadgeText, setNextBadgeText] = useState('');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }

          // Fetch enrollments
          const enrollmentsQuery = query(collection(getFirestore(), 'Enrollments'), where('userId', '==', user.uid));
          const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
          setEnrollments(enrollmentsSnapshot.size);

          // Fetch quiz results and calculate total coins
          const quizResultsQuery = query(collection(getFirestore(), 'quizResults'), where('userId', '==', user.uid));
          const quizResultsSnapshot = await getDocs(quizResultsQuery);
          let coins = 0;
          quizResultsSnapshot.forEach(doc => {
            coins += doc.data().coinsEarned;
          });
          setTotalCoins(coins);

          // Assign badges based on points
          const newBadges = [];
          if (coins >= 50) {
            newBadges.push({
              id: 'badge1',
              name: 'Bronze Badge',
              description: 'First Badge for 50 points',
              imageUrl: await getBadgeUrl('award_one.jpg'),
            });
          }
          if (coins >= 150) {
            newBadges.push({
              id: 'badge2',
              name: 'Silver Badge',
              description: 'Second Badge for 150 points',
              imageUrl: await getBadgeUrl('award_two.jpg'),
            });
          }
          if (coins >= 400) {
            newBadges.push({
              id: 'badge3',
              name: 'Gold Badge',
              description: 'Third Badge for 400 points',
              imageUrl: await getBadgeUrl('award_three.jpg'),
            });
          }
          if (coins >= 700) {
            newBadges.push({
              id: 'badge4',
              name: 'Platinum Badge',
              description: 'Fourth Badge for 700 points',
              imageUrl: await getBadgeUrl('award_four.jpg'),
            });
          }
          setBadges(newBadges);

          // Set motivational text based on next badge
          if (coins < 50) {
            setNextBadgeText('🚀 Just starting out? Keep going! The Bronze Badge awaits you! 🏅');
          } else if (coins < 150) {
            setNextBadgeText('🌟 Great progress! The Silver Badge is within your reach. Keep shining! 💪');
          } else if (coins < 400) {
            setNextBadgeText('🏆 You’re on fire! The Gold Badge is just a few steps away. Go for it! 🔥');
          } else if (coins < 700) {
            setNextBadgeText('💎 Amazing work! The Platinum Badge is calling your name. Keep learning! 📚');
          } else {
            setNextBadgeText('🎉 Incredible achievement! You’ve earned all the badges! Keep being awesome! 🥳');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getBadgeUrl = async (badgeName) => {
    const storageRef = ref(storage, `badges/${badgeName}`);
    return await getDownloadURL(storageRef);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
      {/* Header Section */}
      <View style={[styles.header, colorScheme === 'dark' && styles.darkHeader]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={32} color={Colors.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={32} color={Colors.WHITE} />
        </TouchableOpacity>
        <Image
          source={userData.avatar ? { uri: userData.avatar } : Profileavatar}
          style={styles.avatar}
        />
        <Text style={[styles.name, colorScheme === 'dark' && styles.darkText]}>{`${userData.firstName || ''} ${userData.lastName || ''}`}</Text>
        <Text style={[styles.bio, colorScheme === 'dark' && styles.darkText]}>{userData.bio || 'No bio available'}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatBox title="Courses Enrolled" value={enrollments} colorScheme={colorScheme} />
        <StatBox title="Courses Completed" value={userData.coursesCompleted || '0'} colorScheme={colorScheme} />
        <StatBox title="Total Coins" value={totalCoins} colorScheme={colorScheme} />
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, colorScheme === 'dark' && styles.darkText]}>Badges</Text>
        <View style={[styles.badgesContainer, colorScheme === 'dark' && styles.darkBadgesContainer]}>
          {badges.length > 0 ? (
            badges.map(badge => (
              <TouchableOpacity key={badge.id} onPress={() => Alert.alert(badge.name, badge.description)}>
                <Image source={{ uri: badge.imageUrl }} style={styles.badge} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noBadgesContainer}>
              <FontAwesome5 name="medal" size={50} color={colorScheme === 'dark' ? Colors.WHITE : Colors.SECONDARY} />
              <Text style={[styles.noBadgesText, colorScheme === 'dark' && styles.darkText]}>Start learning to earn coins and win badges!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Motivational Text */}
      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, colorScheme === 'dark' && styles.darkText]}>{nextBadgeText}</Text>
        </View>
      )}

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, colorScheme === 'dark' && styles.darkText]}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickActionBox icon="chalkboard-teacher" text="Become a Tutor" isFontAwesome5 link="https://example.com/become-a-tutor" colorScheme={colorScheme} />
          <QuickActionBox icon="question-circle" text="Need Support" link="https://example.com/support" colorScheme={colorScheme} />
          <QuickActionBox icon="user-plus" text="Invite Friends" link="https://example.com/invite-friends" colorScheme={colorScheme} />
          <QuickActionBox icon="eye" text="Change Visibility" colorScheme={colorScheme} />
        </View>
      </View>
    </ScrollView>
  );
}

function StatBox({ title, value, colorScheme }) {
  return (
    <View style={[styles.statBox, colorScheme === 'dark' && styles.darkStatBox]}>
      <Text style={[styles.statValue, colorScheme === 'dark' && styles.darkText]}>{value}</Text>
      <Text style={[styles.statTitle, colorScheme === 'dark' && styles.darkText]}>{title}</Text>
    </View>
  );
}

function QuickActionBox({ icon, text, isFontAwesome5 = false, link, colorScheme }) {
  const handlePress = () => {
    if (link) {
      Linking.openURL(link).catch(err => console.error('An error occurred', err));
    } else {
      Alert.alert('Change Visibility', 'This action will change your visibility settings.');
    }
  };

  return (
    <TouchableOpacity style={[styles.quickActionBox, colorScheme === 'dark' && styles.darkQuickActionBox]} onPress={handlePress}>
      {isFontAwesome5 ? (
        <FontAwesome5 name={icon} size={24} color={colorScheme === 'dark' ? Colors.WHITE : Colors.SECONDARY} />
      ) : (
        <FontAwesome name={icon} size={24} color={colorScheme === 'dark' ? Colors.WHITE : Colors.SECONDARY} />
      )}
      <Text style={[styles.quickActionText, colorScheme === 'dark' && styles.darkQuickActionText]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  darkHeader: {
    backgroundColor: Colors.DARK_PRIMARY,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  avatar: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: (screenWidth * 0.25) / 2,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.WHITE,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  name: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.WHITE,
  },
  darkText: {
    color: Colors.WHITE,
  },
  bio: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
    color: Colors.LIGHT_GRAY,
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginVertical: 20,
    gap: 10,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  darkStatBox: {
    backgroundColor: Colors.DARK_SECONDARY,
    borderColor: Colors.DARK_SECONDARY,
  },
  statValue: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  statTitle: {
    fontSize: screenWidth * 0.038,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
  section: {
    width: '90%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
  },
  darkBadgesContainer: {
    backgroundColor: Colors.DARK_SECONDARY,
    borderColor: Colors.DARK_SECONDARY,
  },
  badge: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  noBadgesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noBadgesText: {
    marginTop: 10,
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  quickActionBox: {
    width: screenWidth * 0.4,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F9FBFE',
    borderRadius: 10,
    marginBottom: 10,
  },
  darkQuickActionBox: {
    backgroundColor: Colors.DARK_SECONDARY,
  },
  quickActionText: {
    marginTop: 10,
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
  darkQuickActionText: {
    color: Colors.WHITE,
  },
});