import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Feather, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors'; // Adjust this path as necessary
import { getAuth, signOut } from 'firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

const CustomDrawerContent = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState('');

  const handlePress = (screen) => {
    setActiveScreen(screen);
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigation.navigate('Login');
  };

  const customDrawerItems = [
    { label: 'Dashboard', icon: <Feather name="home" size={24} />, screen: 'Dashboard' },
    { label: 'Discover', icon: <MaterialIcons name="explore" size={24} />, screen: 'Discover' },
    { label: 'Tutors', icon: <FontAwesome5 name="chalkboard-teacher" size={24} />, screen: 'Tutors' },
    { label: 'Test', icon: <MaterialIcons name="menu-book" size={24} />, screen: 'Test', badge: 'New' },
    { label: 'Referrals', icon: <FontAwesome6 name="slideshare" size={24} />, screen: 'Referrals' },
    { label: 'Support', icon: <MaterialIcons name="support-agent" size={24} />, screen: 'Support' },
    { label: 'Settings', icon: <FontAwesome5 name="user-cog" size={24} />, screen: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView contentContainerStyle={styles.drawerContent}>
        {customDrawerItems.map((item) => (
          <TouchableOpacity
            key={item.screen}
            onPress={() => handlePress(item.screen)}
            style={[
              styles.drawerItem,
              activeScreen === item.screen && styles.activeDrawerItem,
              { backgroundColor: activeScreen === item.screen ? Colors.PRIMARY_LIGHTER : '#fff' }
            ]}
          >
            <View style={styles.iconContainer}>
              {React.cloneElement(item.icon, {
                color: activeScreen === item.screen ? Colors.PRIMARY : Colors.SECONDARY,
              })}
            </View>
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.drawerLabel,
                  { color: activeScreen === item.screen ? Colors.PRIMARY : Colors.SECONDARY },
                ]}
              >
                {item.label}
              </Text>
              {item.badge && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>
      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.drawerItem, styles.logoutContainer]}
      >
        <View style={styles.iconContainer}>
          <Feather name="log-out" size={24} color='#F32D3D'/>
        </View>
        <Text style={styles.logoutLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  drawerContent: {
    flexGrow: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 5,
  },
  activeDrawerItem: {
    backgroundColor: Colors.PRIMARY_LIGHTER,
  },
  iconContainer: {
    marginRight: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  drawerLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.04,
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingVertical: 1,
    paddingHorizontal: 8,
    marginRight: screenWidth * 0.15,
  },
  badgeText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.025,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.04,
    color: '#F32D3D',
    marginLeft: 10,
  },
});

export default CustomDrawerContent;