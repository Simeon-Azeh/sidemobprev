import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import celebrationImage from '../../../assets/Images/celebration.png';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CelebrationPage = ({ route, navigation }) => {
  const { item, scratchCode, coinsSpent } = route.params;
  const [expirationDate, setExpirationDate] = useState('');
  const viewShotRef = useRef();
  const db = getFirestore();

  useEffect(() => {
    const fetchRedemptionDetails = async () => {
      try {
        const docRef = doc(db, 'CoinsRedeemed', scratchCode);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const redeemedAt = docSnap.data().redeemedAt.toDate();
          const expiration = new Date(redeemedAt);
          expiration.setMonth(expiration.getMonth() + 1);
          setExpirationDate(expiration);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching redemption details:', error);
      }
    };

    fetchRedemptionDetails();
  }, [scratchCode]);

  // Generate barcode URL
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${scratchCode}&code=Code128&translate-esc=true`;


  const handleDownload = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'There was an error capturing the screen. Please try again.');
    }
  };

  const handleLearnMore = () => {
    Linking.openURL('https://sidecedu.com');
  };

  return (
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={32} color={Colors.SECONDARY} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Image
            source={celebrationImage} // Replace with actual celebration image URL
            style={styles.celebrationImage}
          />
        <Text style={styles.congratulationsText}> Congratulations!🎉 You've scored an amazing deal! 🛍️💸</Text>
        <Text style={{ fontFamily: 'Poppins', fontSize: screenWidth * 0.03, color: Colors.SECONDARY, marginTop: 10, textAlign: 'center' }}>
          Please download your ticket below and present it at the counter to redeem your item.
        </Text>

        </View>
        <View style={styles.ticketContainer}>
          <View style={styles.ticket}>
            <View style={styles.ticketContent}>
              <Text style={styles.ticketTitle}> Ticket</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex' }}>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035, flex: 1, color: Colors.SECONDARY }}>Item</Text>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035, color: Colors.PRIMARY }}>{item.name}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex' }}>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035, color: Colors.SECONDARY, flex: 1 }}>Coins Redeemed</Text>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035, color: Colors.PRIMARY, marginLeft: 5, display: 'flex', gap: 10 }}>
                  <FontAwesome6 name="coins" size={18} color={Colors.PRIMARY} style={{ marginRight: 10 }} />{coinsSpent}
                </Text>
              </View>
            
              <Image
                source={{ uri: barcodeUrl }} // Use generated barcode URL
                style={styles.barcode}
              />
              <View style={styles.ticketCutOut}>
                <View style={styles.cutCircleLeft} />
                <Text style={styles.ticketDash}>--------------------------------</Text>
                <View style={styles.cutCircleRight} />
              </View>
              <Text style={styles.ticketNumber}>{scratchCode}</Text>
            </View>
            
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Ionicons name="download" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 40,
    zIndex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  celebrationImage: {
    width: screenWidth * 0.95,
    height: screenWidth * 0.85,
    resizeMode: 'contain',
    marginTop: screenHeight * 0.05,
  },
  congratulationsText: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
  ticketContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#9835ff',
    height: screenHeight * 0.5,
  },
  ticket: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: screenWidth * 0.9,
    alignItems: 'center',
    elevation: 2, // Remove shadow
    marginTop: screenHeight * -0.03,
    position: 'relative', // For positioning the floating button
  },
  ticketContent: {
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  ticketDetail: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
    marginVertical: 5,
  },
  barcode: {
    width: screenWidth * 0.74, // Adjusted width
    height: screenWidth * 0.26, // Adjusted height
    marginVertical: 20,
  },
  ticketCutOut: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  ticketDash: {
    color: '#f2f2f2',
    fontSize: screenWidth * 0.04,
  },
  cutCircleLeft: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#9835ff',
    position: 'absolute',
    left: screenWidth * -0.3,
  },
  cutCircleRight: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#9835ff',
    position: 'absolute',
    right: screenWidth * -0.3,
  },
  ticketNumber: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginTop: 10,
  },
  downloadButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  learnMoreButton: {
    backgroundColor: Colors.SECONDARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  learnMoreButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
  },
});

export default CelebrationPage;