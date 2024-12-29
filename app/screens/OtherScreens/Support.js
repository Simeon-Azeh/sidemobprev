import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import GreetingCard from '../../components/General/GreetingCard';
import Header from '../../components/General/Header';
import { Feather } from '@expo/vector-icons'; // Import Feather icons
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function Support() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
      <Header />
      <View style={styles.greetingContainer}>
        <GreetingCard />
      </View>
      <View style={styles.supportOptions}>
        <Text style={[styles.supportTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Need Support?</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_BUTTON }]}>
          <Text style={[styles.buttonText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Live Chat</Text>
          <Feather name="chevron-right" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_BUTTON }]} onPress={() => navigation.navigate('FAQS')}>
          <Text style={[styles.buttonText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>FAQs</Text>
          <Feather name="chevron-right" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_BUTTON }]} onPress={() => navigation.navigate('Contact')}>
          <Text style={[styles.buttonText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Contact Us</Text>
          <Feather name="chevron-right" size={24} color={colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greetingContainer: {
    marginVertical: 15,
  },
  supportOptions: {
    marginTop: 20,
  },
  supportTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    flex: 1,
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
});