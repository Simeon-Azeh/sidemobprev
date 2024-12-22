import React from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Main/HomeScreen';
import Courses from '../screens/Main/Courses';
import Resource from '../screens/Main/Resource';
import IQlink from '../screens/Main/IQlink';
import Messages from '../screens/Main/Messages';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';


const { width: screenWidth } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const TabLabel = ({ focused, children }) => {
  const [fontsLoaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
  })
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={[styles.tabLabel, { color: focused ? '#9835FF' : 'gray' }]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontFamily: 'Poppins',
    fontSize: screenWidth * 0.025,
  },
});

export default function TabNavigations() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name === 'Courses') {
            iconName = focused ? 'book-open' : 'book-open';
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name === 'Resources') {
            iconName = focused ? 'database' : 'database';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chat-bubble-outline' : 'chat-bubble-outline';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'IQlink') {
            iconName = focused ? 'dataset-linked' : 'dataset-linked';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          }
        },
        tabBarLabel: ({ focused }) => (
          <TabLabel focused={focused}>
            {route.name}
          </TabLabel>
        ),
        tabBarActiveTintColor: '#9835FF', // Active color
        tabBarInactiveTintColor: 'gray', // Inactive color
        tabBarStyle: {
          paddingBottom: 10, // Padding bottom
          paddingTop: 10, // Padding top
          height: 80, // Height of the tab bar
          backgroundColor: '#ffffff', // Background color
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={Courses} />
      <Tab.Screen name="Resources" component={Resource} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="IQlink" component={IQlink} />
    </Tab.Navigator>
  );
}
