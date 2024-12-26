import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '../../components/General/Header';
import LeaderboardImg from '../../../assets/Images/LeaderboardImg.png';
import Colors from '../../../assets/Utils/Colors';
import { Calendar } from 'react-native-calendars';
import UpcomingTasks from '../../components/Discover/UpcomingTasks';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Discover() {
  const navigation = useNavigation();
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchLeaderboardData = async () => {
    setLoadingLeaderboard(true);
    const db = getFirestore();
    const usersPoints = {};

    try {
      const querySnapshot = await getDocs(collection(db, 'quizResults'));
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const userId = data.userId;
        const coinsEarned = data.coinsEarned;

        if (usersPoints[userId]) {
          usersPoints[userId] += coinsEarned;
        } else {
          usersPoints[userId] = coinsEarned;
        }
      });

      const usersData = await Promise.all(
        Object.keys(usersPoints).map(async userId => {
          const userDoc = await getDoc(doc(db, 'users', userId));
          const userData = userDoc.data();
          return {
            id: userId,
            name: userData.firstName,
            coins: usersPoints[userId],
            profileImage: userData.avatar,
            status: 'up', // Placeholder status
          };
        })
      );

      usersData.sort((a, b) => b.coins - a.coins);
      setLeaderboardData(usersData); // All users sorted by points
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();

    const interval = setInterval(() => {
      fetchLeaderboardData();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.leaderboardContainer}>
          <Image source={LeaderboardImg} style={styles.leaderboardImg} />

          {loadingLeaderboard ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : (
            leaderboardData.slice(0, 3).map((user, index) => (
              <View
                key={user.id}
                style={[
                  styles.leaderboardItem,
                  {
                    left: index === 1 ? '12%' : index === 2 ? '68%' : '40%',
                    top: index === 1 ? '25%' : index === 2 ? '30%' : '10%', // Adjust top positions
                  },
                ]}
              >
                <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                <Text style={styles.username}>
                  {user.name}
                  {currentUser && currentUser.uid === user.id && (
                    <Ionicons name="sparkles-sharp" size={16} color="#9835ff" style={styles.currentUserIcon} />
                  )}
                </Text>
                <View style={styles.coinContainer}>
                  <Icon name="coins" size={16} color="#9835ff" />
                  <Text style={styles.coins}>+{user.coins}</Text>
                  <Icon
                    name={user.status === 'up' ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={user.status === 'up' ? '#9835ff' : '#ff0000'}
                    style={styles.statusIcon}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.otherUsersContainer}>
          {leaderboardData.slice(3).map((user) => (
            <View key={user.id} style={styles.otherUserItem}>
              <Image source={{ uri: user.profileImage }} style={styles.profileImageSmall} />
              <Text style={styles.usernameSmall}>
                {user.name}
                {currentUser && currentUser.uid === user.id && (
                  <Ionicons name="sparkles-sharp" size={24} color="black" style={styles.currentUserIconSmall} />
                )}
              </Text>
              <View style={styles.coinContainerSmall}>
                <Icon name="coins" size={16} color="#9835ff" />
                <Text style={styles.coinsSmall}>+{user.coins}</Text>
                <Icon
                  name={user.status === 'up' ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={user.status === 'up' ? '#9835ff' : '#ff0000'}
                  style={styles.statusIconSmall}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{...styles.button, backgroundColor: '#fff', borderColor: '#9835ff', borderWidth: 1}} onPress={() => navigation.navigate('RedeemPage')} >
            <Text style={{...styles.buttonText, color: '#9835ff'} }>Redeem Coins</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.button, backgroundColor: '#9835ff', marginLeft: 10}} onPress={() => navigation.navigate('RedeemedTicketsPage')} >
            <Text style={{...styles.buttonText, color: '#fff'} }>View Tickets</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Welcome to the community!</Text>
              <Text style={styles.modalText}>You're now part of the community! Take part by taking our mock test and join our leader board.</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.calendarContainer}>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            theme={{
              todayButtonTextColor: Colors.PRIMARY,
              arrowColor: Colors.PRIMARY,
              monthTextColor: Colors.SECONDARY,
              textDayHeaderFontFamily: 'Poppins-Medium',
              textMonthFontFamily: 'Poppins-Medium',
              textDayFontFamily: 'Poppins-Medium',
              textDayFontSize: screenWidth * 0.03,
              textDayHeaderFontSize: screenWidth * 0.03,
              textMonthFontSize: screenWidth * 0.04,
              textMonthFontWeight: 'normal',
              todayTextColor: '#fff',
              todayBackgroundColor: Colors.PRIMARY,
              selectedDayTextColor: '#fff',
              selectedDayBackgroundColor: '#9835ff',
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  leaderboardContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  leaderboardImg: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.45,
  },
  leaderboardItem: {
    position: 'absolute',
    alignItems: 'center',
  },
  profileImage: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: 50,
  },
  username: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    marginTop: 2,
    color: Colors.SECONDARY,
  },
  currentUserIcon: {
    marginLeft: 5,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  coins: {
    fontSize: screenWidth * 0.03,
    color: '#888',
    marginLeft: 5,
    fontFamily: 'Poppins-Medium',
  },
  statusIcon: {
    marginLeft: 5,
  },
  otherUsersContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  otherUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  usernameSmall: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
    color: Colors.SECONDARY,
  },
  currentUserIconSmall: {
    marginLeft: 5,
  },
  coinContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  coinsSmall: {
    fontSize: screenWidth * 0.03,
    color: '#888',
    marginLeft: 5,
    fontFamily: 'Poppins-Medium',
  },
  statusIconSmall: {
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  modalText: {
    fontSize: screenWidth * 0.035,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
    color: Colors.SECONDARY,
  },
  modalButton: {
    backgroundColor: '#9835ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
  },
  calendarContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
});