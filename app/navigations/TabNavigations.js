import React from 'react';
import { Dimensions, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Main/HomeScreen';
import Courses from '../screens/Main/Courses';
import Resource from '../screens/Main/Resource';
import IQlink from '../screens/Main/IQlink';
import Messages from '../screens/Main/Messages';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import Colors from '../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const TabLabel = ({ focused, children }) => {
  const [fontsLoaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  const colorScheme = useColorScheme();
  const themeTextColor = focused
    ? colorScheme === 'light'
      ? Colors.PRIMARY
      : Colors.WHITE
    : colorScheme === 'light'
    ? Colors.SECONDARY
    : Colors.DARK_TEXT_MUTED;

  return (
    <Text style={[styles.tabLabel, { color: themeTextColor }]}>
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
  const colorScheme = useColorScheme();
  const themeBackgroundColor = colorScheme === 'light' ? Colors.WHITE : Colors.DARK_BACKGROUND;
  const themeActiveTintColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.WHITE;
  const themeInactiveTintColor = colorScheme === 'light' ? 'gray' : Colors.DARK_TEXT_MUTED;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name === 'Courses') {
            iconName = 'book-open';
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name === 'Resources') {
            iconName = 'database';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Messages') {
            iconName = 'chat-bubble-outline';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'IQlink') {
            iconName = 'dataset-linked';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          }
        },
        tabBarLabel: ({ focused }) => (
          <TabLabel focused={focused}>
            {route.name}
          </TabLabel>
        ),
        tabBarActiveTintColor: themeActiveTintColor, // Active color
        tabBarInactiveTintColor: themeInactiveTintColor, // Inactive color
        tabBarStyle: {
          paddingBottom: 10, // Padding bottom
          paddingTop: 10, // Padding top
          height: 80, // Height of the tab bar
          backgroundColor: themeBackgroundColor, // Background color
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