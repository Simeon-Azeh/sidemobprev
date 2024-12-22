import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import GreetingCard from '../../components/General/GreetingCard';
import Header from '../../components/General/Header';
import { Feather } from '@expo/vector-icons'; // Import Feather icons
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function Support() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View>
      <Header />
      </View>
     <View style={styles.container}>
     <View style={styles.greetingContainer}>
        <GreetingCard />
      </View>
      <View style={styles.supportOptions}>
        <Text style={styles.supportTitle}>Need Support?</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Live Chat</Text>
          <Feather name="chevron-right" size={24} color={styles.buttonText.color} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FAQS')}>
          <Text style={styles.buttonText}>FAQs</Text>
          <Feather name="chevron-right" size={24} color={styles.buttonText.color} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.buttonText}>Contact Us</Text>
          <Feather name="chevron-right" size={24} color={styles.buttonText.color} />
        </TouchableOpacity>
      </View>
     </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   padding: 20,
   backgroundColor: '#fff',
   
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
    color: Colors.SECONDARY,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    flex: 1,
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
});
