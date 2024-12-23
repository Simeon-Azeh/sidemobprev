import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert, Image } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../assets/Utils/Colors';
import MessageHeader from '../../components/Messages/MessageHeader';
import ChatCard from '../../components/Messages/ChatCard';
import GroupCreationModal from '../../components/Messages/GroupCreationModal';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, onSnapshot, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

const PeopleTab = ({ users }) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <ChatCard chat={item} />
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
    />
  );
};

const GroupsTab = ({ groups }) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={groups}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.groupCard}
          onPress={() => navigation.navigate('GroupChatPage', { chat: item })}
        >
          <Image source={{ uri: item.profilePicture }} style={styles.groupAvatar} />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const db = getFirestore();
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const usersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: `${data.firstName} ${data.lastName}`,
            profileImage: data.avatar || 'default_avatar_url', // Ensure a default avatar URL if none is provided
            time: data.lastMessageTime ? new Date(data.lastMessageTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            message: data.lastMessage || 'Select chat to start messaging',
            email: data.email,
          };
        }).filter(user => user.email !== currentUser.email); // Filter out the authenticated user
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchGroups = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const db = getFirestore();
        const groupsRef = collection(db, 'groups');
        const querySnapshot = await getDocs(groupsRef);
        const groupsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).filter(group => group.visibility === 'public' || group.members.includes(currentUser.email) || group.createdBy === currentUser.email);
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchUsers();
    fetchGroups();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.visibility === 'public' || group.members.includes(getAuth().currentUser.email) || group.createdBy === getAuth().currentUser.email
  );

  const renderScene = SceneMap({
    chats: () => <PeopleTab users={filteredUsers} />,
    groups: () => <GroupsTab groups={filteredGroups} />,
  });

  const handleAddNewChat = () => {
    setIsModalVisible(true);
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors.PRIMARY }}
      style={styles.tabBar}
      activeColor={Colors.PRIMARY}
      inactiveColor="#888"
      renderLabel={({ route, focused }) => (
        <View style={styles.tabLabelContainer}>
          <Icon name={route.key === 'chats' ? 'message-square' : 'users'} size={20} color={focused ? Colors.PRIMARY : '#888'} />
          <Text style={[styles.tabLabel, { color: focused ? Colors.PRIMARY : '#888' }]}>
            {route.title}
          </Text>
        </View>
      )}
      pressColor='#f9feff'
    />
  );

  return (
    <View style={styles.container}>
      <MessageHeader setSearchText={setSearchText} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={renderTabBar}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddNewChat}>
        <MaterialCommunityIcon name="message-plus-outline" size={30} color="#fff" />
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
    backgroundColor: '#f9f9f9',
  },
  tabBar: {
    backgroundColor: '#fff',
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
    backgroundColor: Colors.PRIMARY,
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
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginTop: 20,
    fontSize: screenWidth * 0.04,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  groupDescription: {
    fontFamily: 'Poppins',
    color: '#888',
  },
});