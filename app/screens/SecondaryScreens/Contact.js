import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';
import { Feather, FontAwesome, Entypo } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';


const { width: screenWidth } = Dimensions.get('window');


const ContactScreen = () => {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Contact Us</Text>
        
        {/* Paragraph */}
        <Text style={styles.paragraph}>
          If you have any questions or need further assistance, please don't hesitate to reach out to our customer support team. We are here to help you with any inquiries or issues you may have.
        </Text>
        
        {/* Customer Support Contacts */}
        <View style={styles.contactContainer}>
          <Text style={styles.subtitle}>Customer Support</Text>
          <View style={styles.contactItem}>
            <Feather name="phone" size={20} color="#333" />
            <Text style={styles.contactText}>+250 725 354 096</Text>
          </View>
          <View style={styles.contactItem}>
            <Feather name="mail" size={20} color="#333" />
            <Text style={styles.contactText}>support@sidecedu.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Entypo name="location-pin" size={20} color="#333" />
            <Text style={styles.contactText}>123 Bumbogo St, Kigali, Rwanda</Text>
          </View>
        </View>
        
        {/* Social Media Links */}
        <View style={styles.socialContainer}>
          <Text style={styles.subtitle}>Follow Us</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => openLink('https://facebook.com')}>
              <Entypo name="facebook-with-circle" size={35} color="#9835ff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://twitter.com')}>
              <Entypo name="twitter-with-circle" size={35} color="#9835ff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://instagram.com')}>
              <Entypo name="instagram-with-circle" size={35} color="#9835ff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://linkedin.com')}>
              <Entypo name="linkedin-with-circle" size={35} color="#9835ff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Copyright */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 OurApp. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
    color: Colors.SECONDARY,
  },
  paragraph: {
    fontSize: screenWidth * 0.03,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'Poppins',
    color: '#888',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
    color: Colors.SECONDARY,
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginLeft: 10,
  },
  socialContainer: {
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 20
  },
  footer: {
    padding: 15,
   
    
    alignItems: 'center',
  },
  footerText: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
    color: '#888',
  },
});

export default ContactScreen;
