import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoadingScreen from './app/components/landing/Loading';
import WelcomeScreen from './app/screens/landing/Welcome';
import RegisterScreen from './app/screens/Authentication/Register';
import LoginScreen from './app/screens/Authentication/Login';
import Onboarding from './app/screens/landing/Onboarding';
import ForgotPassword from './app/screens/Authentication/ForgotPassword';
import { Feather, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import TabNavigations from './app/navigations/TabNavigations';
import Colors from './assets/Utils/Colors';
import Discover from './app/screens/OtherScreens/Discover';
import Tutors from './app/screens/OtherScreens/Tutors';
import Test from './app/screens/OtherScreens/Test';
import Referals from './app/screens/OtherScreens/Referals';
import Support from './app/screens/OtherScreens/Support';
import Settings from './app/screens/OtherScreens/Settings';
import CustomDrawerContent from './app/components/General/CustomDrawerContent';
import Profile from './app/screens/OtherScreens/Profile';
import ForgotPasswordSettings from './app/screens/Authentication/ResetSettingsPass';
import Notifications from './app/screens/SecondaryScreens/Notifications';
import FAQScreen from './app/screens/SecondaryScreens/FAQs';
import ContactScreen from './app/screens/SecondaryScreens/Contact';
import SavedCourses from './app/screens/Courses/SavedCourses';
import Certificate from './app/screens/Courses/Certificates';
import Messages from './app/screens/Main/Messages';
import ChatPage from './app/components/Messages/ChatPage';
import ProfilePage from './app/components/Messages/ProfilePage';
import CourseEnrolment from './app/screens/Courses/CourseEnrolment';
import ResourceDocs from './app/screens/Resources/ResourceDocs';
import PaymentPage from './app/screens/SecondaryScreens/PaymentPage';
import RedeemCoinsPage from './app/screens/SecondaryScreens/RedeemCoins';
import CelebrationPage from './app/screens/SecondaryScreens/CelebrationPage';
import QuizInstructions from './app/screens/Mock/QuizInstructions';
import QuizChoice from './app/screens/Mock/QuizChoice';
import QuizScreen from './app/screens/Mock/QuizScreen';
import QuizResults from './app/screens/Mock/ResultsPage';
import CorrectAnswersScreen from './app/screens/Mock/CorrectAnswers';
import CourseMaterial from './app/screens/Courses/CourseMaterial';
import SubtopicDetails from './app/screens/Courses/SubtopicDetails';
import Notes from './app/screens/SecondaryScreens/Notes';
import FullNote from './app/screens/SecondaryScreens/FullNote';
import EnrolledCourses from './app/screens/Courses/EnrolledCourses';
import UploadPost from './app/screens/IQlink/UploadPost';
import IQprofile from './app/screens/IQlink/IQProfile';
import AppointmentBooking from './app/screens/SecondaryScreens/AppointmentBooking';
import CustomHeaderTitle from './app/components/General/CustomHeaderTitle';
import GroupChatPage from './app/components/Messages/GroupChatPage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator component
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: screenWidth * 0.7,
          padding: 10,
        },
        drawerActiveTintColor: '#9835ff', // Active item color
        drawerInactiveTintColor: Colors.SECONDARY, // Inactive item color
        drawerLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 18,
        },
        drawerPressColor: Colors.PRIMARY, // Press color
        drawerItemStyle: {
          borderRadius: 8,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={TabNavigations}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Discover"
        component={Discover}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="explore" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Tutors"
        component={Tutors}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="chalkboard-teacher" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Test"
        component={Test}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Referrals"
        component={Referals}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="slideshare" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Support"
        component={Support}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="support-agent" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="user-cog" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
  });

  const [initialRoute, setInitialRoute] = React.useState('LoadingScreen');
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setInitialRoute('Drawer');
      } else {
        setUser(null);
        setInitialRoute('Login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ 
            title: 'Profile', 
            headerTitle: () => <CustomHeaderTitle title="Profile" /> 
          }} 
        />
        <Stack.Screen 
          name="TutorDetails" 
          component={AppointmentBooking} 
          options={{ 
            title: 'Tutor Details', 
            headerTitle: () => <CustomHeaderTitle title="Tutor Details" /> 
          }} 
        />
        <Stack.Screen name="SavedCourses" component={SavedCourses} options={{ title: 'Saved Courses',
          headerTitle: () => <CustomHeaderTitle title="Saved Courses" />
         }} />
        <Stack.Screen name="Certificates" component={Certificate} options={{ title: 'Certificates',
          headerTitle: () => <CustomHeaderTitle title="Certificates" />
         }} />
        <Stack.Screen name="CourseEnrolment" component={CourseEnrolment} options={{ headerShown: false }} />
        <Stack.Screen name="ResourceData" component={ResourceDocs} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications',
          headerTitle: () => <CustomHeaderTitle title="Notifications" />
         }} />
        <Stack.Screen name="FAQS" component={FAQScreen} options={{ title: 'FAQ',
          headerTitle: () => <CustomHeaderTitle title="FAQ" />
         }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact',
          headerTitle: () => <CustomHeaderTitle title="Contact" />
         }} />
        <Stack.Screen name="ResetPassword" component={ForgotPasswordSettings} options={{ title: 'Reset Password',
          headerTitle: () => <CustomHeaderTitle title="Reset Password" />
         }} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
        <Stack.Screen name="ChatPage" component={ChatPage} options={{ headerShown: false }} />
        <Stack.Screen name="GroupChatPage" component={GroupChatPage} options={{ headerShown: false }} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ title: 'Profile' }} />
        <Stack.Screen name="PaymentPage" component={PaymentPage} options={{ title: 'Pay',
          headerTitle: () => <CustomHeaderTitle title="Pay" />
         }} />
        <Stack.Screen name="RedeemPage" component={RedeemCoinsPage} options={{ headerShown: false }} />
        <Stack.Screen name="CelebrationPage" component={CelebrationPage} options={{headerShown: false  }} />
        <Stack.Screen name="QuizInstructions" component={QuizInstructions} options={{ headerShown: false }} />
        <Stack.Screen name="QuizChoice" component={QuizChoice} options={{ headerShown: false }} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QuizResults" component={QuizResults} options={{ headerShown: false  }} />
        <Stack.Screen name="CorrectAnswers" component={CorrectAnswersScreen} options={{ headerShown: false  }} />
        <Stack.Screen name="CourseMaterial" component={CourseMaterial} options={{ headerShown: false  }} />
        <Stack.Screen name="SubtopicDetails" component={SubtopicDetails} options={{ headerShown: false  }} />
        <Stack.Screen name="Notes" component={Notes} options={{ headerShown: false  }} />
        <Stack.Screen name="FullNote" component={FullNote} options={{ headerShown: false  }} />
        <Stack.Screen name="EnrolledCourses" component={EnrolledCourses} options={{ headerShown: false  }} />
        <Stack.Screen name='UploadPost' component={UploadPost} options={{ title: 'Upload Post',
          headerTitle: () => <CustomHeaderTitle title="Upload Post" />
         }} />
        <Stack.Screen name='IQprofile' component={IQprofile} options={{ title: 'Profile',
          headerTitle: () => <CustomHeaderTitle title="Feed" />
         }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});