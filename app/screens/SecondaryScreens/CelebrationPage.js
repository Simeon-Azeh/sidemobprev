import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import celebrationImage from '../../../assets/Images/celebration.png';
import barcodeimg from '../../../assets/Images/barcode.png';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CelebrationPage = ({ route, navigation }) => {
  const { item } = route.params;

  return (
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
        <Text style={styles.congratulationsText}>Wohoo! you grabbed a deal!</Text>

       
      </View>
      <View style={styles.ticketContainer}>
      <View style={styles.ticket}>
          <View style={styles.ticketContent}>
            <Text style={styles.ticketTitle}> Ticket</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex'  }}>
            <Text style={{fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035, flex: 1, color: Colors.SECONDARY }}>Item</Text>
            <Text style={{fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035,   color: Colors.PRIMARY }}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex'  }}>
            <Text style={{fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035,   color: Colors.SECONDARY, flex: 1 }}>Coins Redeemed</Text>
            <Text style={{fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.035,   color: Colors.PRIMARY, marginLeft: 5, display: 'flex', gap: 5 }}><FontAwesome6 name="coins" size={18} color={Colors.PRIMARY} style={{marginRight: 5}} />{item.coins}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex', marginTop: 10  }}>
            <Text style={{fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.025,   color: Colors.SECONDARY, flex: 1 }}>Expiration Date</Text>
            <Text style={{fontFamily: 'Poppins-Medium', fontSize: screenWidth * 0.025,   color: Colors.PRIMARY, marginLeft: 5, display: 'flex', gap: 5 }}> 12/31/2024</Text>
                </View>
          
          
            <Image
              source={barcodeimg} // Replace with actual barcode image URL
              style={styles.barcode}
            />
            <View style={styles.ticketCutOut}>
              <View style={styles.cutCircleLeft} />
              <Text style={styles.ticketDash}>--------------------------------</Text>
              <View style={styles.cutCircleRight} />
            </View>
            <Text style={styles.ticketNumber}> #A123FA4567E89</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    width: screenWidth * 0.9,
    height: screenWidth * 0.25,
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
});

export default CelebrationPage;
