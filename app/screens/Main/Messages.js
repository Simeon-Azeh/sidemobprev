import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert, Image } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'; // Ensure SceneMap is imported
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../assets/Utils/Colors';
import MessageHeader from '../../components/Messages/MessageHeader';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const chats = [
  {
    id: '2',
    name: 'Jessy Nfor',
    message: 'Hello! Just wanted to check in...',
    time: 'Just now',
    unreadMessages: 1,
    profileImage: require('../../../assets/Images/avatar3.jpg'),
    active: true,  // Active status
    verified: false, // Add this property to indicate verified users
  },
  {
    id: '3',
    name: 'aron56',
    message: 'Hey bro, Congratulations on making it to top 5',
    time: '9:15 AM',
    unreadMessages: 1,
    profileImage: require('../../../assets/Images/avatar6.jpg'),
    active: false,  // Active status
    verified: false, // Add this property to indicate verified users
  },
  {
    id: '1',
    name: 'Sidec Support',
    message: 'Welcome to Sidec! How can we assist you today?',
    time: '40 mins ago',
    unreadMessages: 1,
    profileImage: require('../../../assets/Images/Profile.png'),
    active: true,  // Inactive status
    verified: true, // Add this property to indicate verified users
  },
];

const PeopleTab = () => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() => navigation.navigate('ChatPage', {
            chat: item,
            realTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Pass the real timestamp
          })}
        >
          <View style={styles.profileImageContainer}>
            <Image source={item.profileImage} style={styles.profileImage} />
            {item.active && <View style={styles.activeBadge} />}
          </View>
          <View style={styles.chatInfo}>
            <View style={styles.chatInfoTop}>
              <Text style={styles.chatName}>
                {item.name}
                {item.verified && <MaterialIcons name="verified" size={14} color={Colors.PRIMARY} style={styles.verifiedIcon} />}
              </Text>

            </View>
            <Text style={styles.messagePreview}>
              {item.message.length > 25 ? `${item.message.substring(0, 25)}...` : item.message}
            </Text>
          </View>
          <View style={styles.chatDetails}>
            <Text style={styles.messageTime}>{item.time}</Text>
            {item.unreadMessages > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadMessages}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
    />
  );
};

const GroupsTab = () => (
  <View style={styles.centeredView}>
    <Icon name="users" size={50} color="#888" />
    <Text style={styles.noGroupsText}>
      No groups available yet, come back soon!
    </Text>
  </View>
);

export default function Messages() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'chats', title: 'Chats' },
    { key: 'groups', title: 'Groups' },
  ]);

  const renderScene = SceneMap({
    chats: PeopleTab,
    groups: GroupsTab,
  });

  const handleAddNewChat = () => {
    Alert.alert('Add New Chat', 'We are working on it.');
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
      <MessageHeader />
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
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: 25,
  },
  activeBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.PRIMARY,
    borderColor: '#fff',
    borderWidth: 2,
  },
  chatInfo: {
    flex: 1,
  },
  chatInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  chatName: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  
  
  messagePreview: {
    color: '#888',
    marginTop: 2,
    fontFamily: 'Poppins',
    fontSize: screenWidth * 0.03,
  },
  chatDetails: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: screenWidth * 0.03,
    color: '#888',
  },
  unreadBadge: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: screenWidth * 0.03,
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
  verifiedIcon: {
    marginLeft: 8, // Horizontal spacing from the text
    marginTop: 2,  // Vertical alignment with the text
  },
});
