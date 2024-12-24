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
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, storage } from '../../../firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState(0);
  const [badges, setBadges] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [nextBadgeText, setNextBadgeText] = useState('');

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={userData.avatar ? { uri: userData.avatar } : Profileavatar}
          style={styles.avatar}
        />
        <Text style={styles.name}>{`${userData.firstName || ''} ${userData.lastName || ''}`}</Text>
        <Text style={styles.bio}>{userData.bio || 'No bio available'}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatBox title="Courses Enrolled" value={enrollments} />
        <StatBox title="Courses Completed" value={userData.coursesCompleted || '0'} />
        <StatBox title="Total Coins" value={totalCoins} />
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesContainer}>
          {badges.length > 0 ? (
            badges.map(badge => (
              <TouchableOpacity key={badge.id} onPress={() => Alert.alert(badge.name, badge.description)}>
                <Image source={{ uri: badge.imageUrl }} style={styles.badge} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noBadgesContainer}>
              <FontAwesome5 name="medal" size={50} color={Colors.SECONDARY} />
              <Text style={styles.noBadgesText}>Start learning to earn coins and win badges!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Motivational Text */}
      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{nextBadgeText}</Text>
        </View>
      )}

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickActionBox icon="chalkboard-teacher" text="Become a Tutor" isFontAwesome5 link="https://example.com/become-a-tutor" />
          <QuickActionBox icon="question-circle" text="Need Support" link="https://example.com/support" />
          <QuickActionBox icon="user-plus" text="Invite Friends" link="https://example.com/invite-friends" />
          <QuickActionBox icon="eye" text="Change Visibility" />
        </View>
      </View>
    </ScrollView>
  );
}

function StatBox({ title, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function QuickActionBox({ icon, text, isFontAwesome5 = false, link }) {
  const handlePress = () => {
    if (link) {
      Linking.openURL(link).catch(err => console.error('An error occurred', err));
    } else {
      Alert.alert('Change Visibility', 'This action will change your visibility settings.');
    }
  };

  return (
    <TouchableOpacity style={styles.quickActionBox} onPress={handlePress}>
      {isFontAwesome5 ? (
        <FontAwesome5 name={icon} size={24} color={Colors.SECONDARY} />
      ) : (
        <FontAwesome name={icon} size={24} color={Colors.SECONDARY} />
      )}
      <Text style={styles.quickActionText}>{text}</Text>
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
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
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
    backgroundColor: '#f0f0f0',
   padding: 10,
  },
  badge: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    paddingTop: 40,
  
    
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
  quickActionText: {
    marginTop: 10,
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
});