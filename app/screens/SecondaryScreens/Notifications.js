import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import NotificationsImg from '../../../assets/Images/NotificationsImg.png';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const defaultNotification = {
  id: 'default',
  type: 'info',
  content: 'Welcome to Sidec!',
  description: 'We are glad to have you here. Explore and enjoy our services.',
  unread: true,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const defaultNotificationRef = doc(db, 'notifications', `${user.uid}_default`);
          const defaultNotificationDoc = await getDoc(defaultNotificationRef);

          if (!defaultNotificationDoc.exists()) {
            await setDoc(defaultNotificationRef, {
              ...defaultNotification,
              userId: user.uid,
            });
          }

          const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setNotifications(fetchedNotifications);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = () => {
    notifications.forEach(async (notification) => {
      if (notification.unread && notification.id !== 'default') {
        const db = getFirestore();
        const notificationRef = doc(db, 'notifications', notification.id);
        await updateDoc(notificationRef, { unread: false });
      }
    });
    setNotifications(notifications.map(notification => ({ ...notification, unread: false })));
  };

  const handleOptionsPress = (id) => {
    setShowOptions(id);
  };

  const markNotificationAsRead = (id) => {
    if (id === 'default') {
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      ));
    } else {
      const db = getFirestore();
      const notificationRef = doc(db, 'notifications', id);
      updateDoc(notificationRef, { unread: false });
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      ));
    }
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prevSelected => 
      prevSelected.includes(id) ? prevSelected.filter(item => item !== id) : [...prevSelected, id]
    );
  };

  const unreadNotifications = notifications.some(notification => notification.unread);

  const renderNotification = ({ item }) => (
    <View style={[styles.notificationContainer, colorScheme === 'dark' && styles.darkNotificationContainer]}>
      <TouchableOpacity onPress={() => handleSelectNotification(item.id)}>
        <Icon 
          name={selectedNotifications.includes(item.id) ? 'check-square' : 'square'} 
          size={20} 
          color={colorScheme === 'dark' ? Colors.WHITE : Colors.PRIMARY} 
          style={styles.selectIcon} 
        />
      </TouchableOpacity>
      <View style={styles.notificationContent}>
        <Icon name={item.type} size={20} color={colorScheme === 'dark' ? Colors.WHITE : "#888"} style={styles.notificationIcon} />
        <View>
          <Text style={[styles.notificationText, item.unread && styles.unreadNotification, colorScheme === 'dark' && styles.darkText]}>
            {item.content}
          </Text>
          <Text style={[styles.notificationDescription, colorScheme === 'dark' && styles.darkText]} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleOptionsPress(item.id)}>
        <Icon name="more-vertical" size={20} color={colorScheme === 'dark' ? Colors.WHITE : "#888"} />
      </TouchableOpacity>
      {showOptions === item.id && (
        <View style={[styles.optionsContainer, colorScheme === 'dark' && styles.darkOptionsContainer]}>
          <TouchableOpacity style={styles.optionButton} onPress={() => markNotificationAsRead(item.id)}>
            <Text style={[styles.optionText, colorScheme === 'dark' && styles.darkText]}>Mark as Read</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
      <View style={[styles.header, colorScheme === 'dark' && styles.darkHeader]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={32} color={Colors.WHITE} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, colorScheme === 'dark' && styles.darkText]}>Notifications</Text>
      </View>
      {selectedNotifications.length > 0 && (
        <TouchableOpacity style={styles.deleteSelectedButton} onPress={() => setSelectedNotifications([])}>
          <Text style={styles.buttonText}>Deselect All</Text>
        </TouchableOpacity>
      )}
      {unreadNotifications && (
        <TouchableOpacity style={styles.markAsReadButton} onPress={markAllAsRead}>
          <Text style={styles.buttonText}>Mark All as Read</Text>
        </TouchableOpacity>
      )}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={NotificationsImg} style={styles.emptyImage} />
          <Text style={[styles.emptyText, colorScheme === 'dark' && styles.darkText]}>You're all caught up</Text>
          <Text style={[styles.emptyDescription, colorScheme === 'dark' && styles.darkText]}>There are no new notifications at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkHeader: {
    backgroundColor: Colors.DARK_PRIMARY,
    borderBottomColor: Colors.DARK_SECONDARY,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  markAsReadButton: {
    backgroundColor: '#9835ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  deleteSelectedButton: {
    backgroundColor: '#e57373',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  darkNotificationContainer: {
    borderBottomColor: Colors.DARK_SECONDARY,
  },
  selectIcon: {
    marginRight: 15,
    alignSelf: 'center',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationText: {
    fontSize: screenWidth * 0.035,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
  unreadNotification: {
    color: Colors.PRIMARY,
  },
  notificationDescription: {
    fontSize: screenWidth * 0.03,
    color: '#667',
    fontFamily: 'Poppins',
  },
  optionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    width: screenWidth * 0.4,
    padding: 5,
  },
  darkOptionsContainer: {
    backgroundColor: Colors.DARK_SECONDARY,
    borderColor: Colors.DARK_PRIMARY,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: screenWidth * 0.03,
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: screenWidth * 0.05,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
  },
  emptyDescription: {
    fontSize: screenWidth * 0.03,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins',
    marginTop: 5,
  },
  darkText: {
    color: Colors.WHITE,
  },
});