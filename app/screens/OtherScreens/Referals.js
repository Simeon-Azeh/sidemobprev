import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Header from '../../components/General/Header';
import referralImage from '../../../assets/Images/ReferImg.png'; // Replace with your image path
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const referralLink = 'https://sidecedu.com/referral'; // Example referral link

export default function Referrals() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied" state after 2 seconds
  };

  const referralTimeline = [
    { stage: 'Sign Up', description: 'Sign up and get your referral link.' },
    { stage: 'Share Link', description: 'Share your referral link with friends.' },
    { stage: 'Earn Rewards', description: 'Earn rewards for every successful referral.' },
  ];

  const referredPeople = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.referralSection}>
            <Image source={referralImage} style={styles.referralImage} />
            <Text style={styles.title}>Refer and Earn</Text>
            <Text style={styles.description}>
              Invite your friends to join and earn rewards. Share your unique referral link and start earning!
            </Text>
            <View style={styles.linkContainer}>
              <Text style={styles.link}>{referralLink}</Text>
              <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                <Icon 
                  name={copied ? 'check' : 'copy'} 
                  size={20} 
                  color="#fff" 
                  style={styles.copyIcon}
                />
                <Text style={styles.copyButtonText}>{copied ? 'Copied' : 'Copy'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            {referralTimeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStage}>{item.stage}</Text>
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                </View>
                {index < referralTimeline.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
            ))}
          </View>
          <View style={styles.referredSection}>
            <Text style={styles.sectionTitle}>Referred People</Text>
            {referredPeople.map((person, index) => (
              <View key={index} style={styles.referredItem}>
                <View style={styles.referredPersonInfo}>
                  <Text style={styles.referredName}>{person.name}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="dollar-sign" size={16} color="#9835ff" style={styles.coinIcon} />
                  <Text style={styles.sideCoinText}>+10 Sidecoin</Text>
                  </View>
                
                </View>
                <Text style={styles.referredEmail}>{person.email}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  referralSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  referralImage: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    marginBottom: 10,
  },
  title: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  description: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
  },
  link: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: '#9835ff',
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9835ff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  copyIcon: {
    marginRight: 5,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  timelineSection: {
    marginLeft: 20, // Ensure padding so that text aligns with line and dot
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
    color: Colors.SECONDARY,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 20, // Adjusted to ensure text is aligned properly
  },
  timelineDot: {
    width: 10,
    height: 10,
    backgroundColor: '#9835ff',
    borderRadius: 5,
    position: 'absolute',
    left: 10, // Position dot to overlap with the line
    top: 8, // Center dot vertically with the line
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#ddd',
    flexGrow: 1,
    marginLeft: 10,
    marginRight: 15,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 20, // Space for the dot and line
  },
  timelineStage: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
  timelineDescription: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
    color: '#888',
  },
  referredSection: {
    marginBottom: 20,
  },
  referredItem: {
    marginBottom: 10,
  },
  referredPersonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referredName: {
    fontSize: screenWidth * 0.035,
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
  coinIcon: {
    marginLeft: 10,
  },
  sideCoinText: {
    fontSize: screenWidth * 0.035,
    color: '#9835ff',
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
  },
  referredEmail: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins',
    color: '#888',
  },
});
