import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, ActivityIndicator, Image, RefreshControl, LayoutAnimation, Platform, UIManager } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../assets/Utils/Colors';
import MessageHeader from '../../components/Messages/MessageHeader';
import ChatCard from '../../components/Messages/ChatCard';
import GroupCreationModal from '../../components/Messages/GroupCreationModal';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useColorScheme } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width: screenWidth } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PeopleTab = ({ users, loading, onRefresh, refreshing }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const themePrimaryColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;

  // Users are already sorted in parent component
  if (loading) {
    return <ActivityIndicator size="large" color={themePrimaryColor} style={styles.loadingIndicator} />;
  }

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <ChatCard chat={item} />}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[themePrimaryColor]}
        />
      }
    />
  );
};

const GroupsTab = ({ groups, loading, onRefresh, refreshing }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const themePrimaryColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;

  if (loading) {
    return <ActivityIndicator size="large" color={themePrimaryColor} style={styles.loadingIndicator} />;
  }

  return (
    <FlatList
      data={groups}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.groupCard, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}
          onPress={() => navigation.navigate('GroupChatPage', { chat: item })}
        >
          <Image source={{ uri: item.profilePicture }} style={styles.groupAvatar} />
          <View style={styles.groupInfo}>
            <Text style={[styles.groupName, { color: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }]}>{item.name}</Text>
            <Text style={[styles.groupDescription, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[themePrimaryColor]}
        />
      }
    />
  );
};

export default function Messages() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'chats', title: 'Chats' },
    { key: 'groups', title: 'Groups' },
  ]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const fetchUsers = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      
      // Create a query to get all users and their last messages
      const usersQuery = query(usersRef);
      const querySnapshot = await getDocs(usersQuery);
      
      const usersData = await Promise.all(querySnapshot.docs.map(async doc => {
        const data = doc.data();
        const chatId = [currentUser.email, data.email].sort().join('_');
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const lastMessageSnap = await getDocs(lastMessageQuery);
        
        const lastMessage = lastMessageSnap.docs[0]?.data();
        
        return {
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`,
          profileImage: data.avatar || 'default_avatar_url',
          email: data.email,
          lastMessage: lastMessage?.text || 'Select chat to start messaging',
          lastMessageTime: lastMessage?.timestamp || null,
        };
      }));

      // Filter out current user and sort by lastMessageTime
      const filteredUsers = usersData
        .filter(user => user.email !== currentUser.email)
        .sort((a, b) => {
          const aTime = a.lastMessageTime?.seconds || 0;
          const bTime = b.lastMessageTime?.seconds || 0;
          return bTime - aTime;
        });

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore();
      const groupsRef = collection(db, 'groups');
      const querySnapshot = await getDocs(groupsRef);
      const groupsData = await Promise.all(querySnapshot.docs.map(async doc => {
        const groupData = doc.data();
        const messagesRef = collection(db, 'groupChats', doc.id, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const messagesSnapshot = await getDocs(messagesQuery);
        const lastMessage = messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data().text : 'No messages yet';
        return {
          id: doc.id,
          ...groupData,
          lastMessage,
        };
      }));
      const filteredGroups = groupsData.filter(group => group.visibility === 'public' || group.members.includes(currentUser.email) || group.createdBy === currentUser.email);
      setGroups(filteredGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    setLoading(true);

    // Real-time listener for all chats
    const unsubscribeChats = users.map(user => {
      const chatId = [currentUser.email, user.email].sort().join('_');
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));

      return onSnapshot(lastMessageQuery, (snapshot) => {
        if (!snapshot.empty) {
          const lastMessage = snapshot.docs[0].data();
          
          // Update users array with new message
          setUsers(prevUsers => {
            const newUsers = [...prevUsers];
            const userIndex = newUsers.findIndex(u => u.email === user.email);
            
            if (userIndex !== -1) {
              newUsers[userIndex] = {
                ...newUsers[userIndex],
                lastMessage: lastMessage.text,
                lastMessageTime: lastMessage.timestamp,
              };
            }

            // Sort users by last message timestamp
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            return newUsers.sort((a, b) => {
              const aTime = a.lastMessageTime?.seconds || 0;
              const bTime = b.lastMessageTime?.seconds || 0;
              return bTime - aTime;
            });
          });
        }
      });
    });

    // Initial fetch
    fetchUsers();
    fetchGroups();

    return () => {
      unsubscribeChats.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    fetchGroups();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.visibility === 'public' || group.members.includes(getAuth().currentUser.email) || group.createdBy === getAuth().currentUser.email
  );

  const renderScene = SceneMap({
    chats: () => <PeopleTab users={filteredUsers} loading={loading} onRefresh={onRefresh} refreshing={refreshing} />,
    groups: () => <GroupsTab groups={filteredGroups} loading={loading} onRefresh={onRefresh} refreshing={refreshing} />,
  });

  const handleAddNewChat = () => {
    setIsModalVisible(true);
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE }}
      style={[styles.tabBar, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}
      activeColor={colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE}
      inactiveColor={colorScheme === 'light' ? '#888' : Colors.DARK_TEXT}
      renderLabel={({ route, focused }) => (
        <View style={styles.tabLabelContainer}>
          <Icon name={route.key === 'chats' ? 'message-square' : 'users'} size={20} color={focused ? (colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE) : (colorScheme === 'light' ? '#888' : Colors.DARK_TEXT)} />
          <Text style={[styles.tabLabel, { color: focused ? (colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE) : (colorScheme === 'light' ? '#888' : Colors.DARK_TEXT) }]}>
            {route.title}
          </Text>
        </View>
      )}
      pressColor={colorScheme === 'light' ? '#f9feff' : Colors.DARK_SECONDARY}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#f9f9f9' : Colors.DARK_BACKGROUND }]}>
      <MessageHeader setSearchText={setSearchText} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={renderTabBar}
      />
      <TouchableOpacity style={[styles.floatingButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : '#fff' }]} onPress={handleAddNewChat}>
        <AntDesign name="addusergroup" size={30} color={colorScheme === 'light' ? '#fff' : '#000'} />
      </TouchableOpacity>
      <GroupCreationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        users={users}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    elevation: 2,
  },
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
  },
  listContent: {
    padding: 10,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGroupsText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginTop: 20,
    fontSize: screenWidth * 0.04,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 5,
  },
  groupDescription: {
    fontFamily: 'Poppins',
    fontSize: 14,
    marginBottom: 5,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});