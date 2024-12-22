import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import redeemImg from '../../../assets/Images/redeem.png'
import DesignUi from '../../../assets/Images/DesignUi.png'
import DesignUi2 from '../../../assets/Images/DesignUi2.png'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RedeemCoinsPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalCoins = 2500;
  const educationItems = [
    { id: '1', name: 'Pencil', icon: 'pencil-outline', coins: 300 },
    { id: '2', name: 'Books', icon: 'book-outline', coins: 500 },
    { id: '3', name: 'Notebook', icon: 'journal-outline', coins: 400 },
  ];
  const partners = [
    { id: '4', name: 'Partner 1', icon: 'business', coins: 800 },
    { id: '5', name: 'Partner 2', icon: 'briefcase', coins: 1000 },
  ];

  const handleRedeemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleRedeemConfirm = () => {
    setModalVisible(false);
    navigation.navigate('CelebrationPage', { item: selectedItem });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Ionicons name={item.icon} size={30} color={Colors.PRIMARY} style={styles.icon} />
        <Text style={styles.cardText}>{item.name}</Text>
      </View>
      <View style={styles.cardCutOut}>
        <View style={styles.circleLeft} />
        <Text style={styles.dash}>--------------------------------</Text>
        <View style={styles.circleRight} />
      </View>
      <TouchableOpacity style={styles.redeemButton} onPress={() => handleRedeemPress(item)}>
        <Text style={styles.redeemButtonText}>
          REDEEM {item.coins} <FontAwesome6 name="coins" size={14} color="#fff" />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Coins</Text>
        <Text style={styles.coinText}>
          <FontAwesome6 name="coins" size={24} color={Colors.WHITE} /> {totalCoins}
        </Text>
        <Image source={DesignUi} style={{ width: screenWidth * 0.5, height: screenHeight * 0.3, position: 'absolute', bottom: 0, right: 0, zIndex: -1, opacity: 0.8 }} />
        <Image source={DesignUi2} style={{ width: screenWidth * 0.5, height: screenHeight * 0.3, position: 'absolute', bottom: 0, left: 0, zIndex: -1, opacity: 0.8 }} />
      </View>

      {/* Education Section */}
      <Text style={styles.sectionTitle}>Education</Text>
      <FlatList
        data={educationItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slider}
      />

      {/* Our Partners Section */}
      <Text style={styles.sectionTitle}>Our Partners</Text>
      <FlatList
        data={partners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slider}
      />

      {/* Redeem Modal */}
      {selectedItem && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Ionicons name="close" size={32} color={Colors.PRIMARY} />
              </TouchableOpacity>
              <Image
                source={redeemImg} // Replace with actual image source
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>Are you sure you want to redeem?</Text>
              <Text style={styles.modalDescription}>
                Do you want to redeem {selectedItem.coins} coins for {selectedItem.name}?
              </Text>
              <TouchableOpacity style={styles.confirmButton} onPress={handleRedeemConfirm}>
                <Text style={styles.confirmButtonText}>REDEEM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
   
  },
  header: {
    backgroundColor: '#9835ff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingTop: screenHeight * 0.06,
    borderBottomLeftRadius: screenWidth * 0.09,
    borderBottomRightRadius: screenWidth * 0.09,
    height: screenHeight * 0.35,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 60,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    textAlign: 'center',
  },
  coinText: {
    fontSize: screenWidth * 0.08,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    textAlign: 'center',
    marginTop: screenHeight * 0.08,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginLeft: 20,
    marginVertical: 10,
  },
  slider: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: screenWidth * 0.4, // Making the card smaller
    alignItems: 'center',
    height: screenHeight * 0.23,
    justifyContent: 'flex-end', // Ensure content aligns properly
  },
  cardContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginTop: 20,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 50,
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginVertical: 25,
  },
  cardCutOut: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  dash: {
    color: '#f2f2f2',
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
  },
  circleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f2f2f2', // Default background color
    position: 'absolute',
    left: -10,
  },
  circleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f2f2f2', // Default background color
    position: 'absolute',
    right: -10,
  },
  redeemButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20, // Add margin above the button for spacing
    alignSelf: 'center', // Center the button horizontally
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: screenWidth * 0.8,
    padding: 20,
    alignItems: 'center',
   
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,

  },
  modalImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: Colors.WHITE,
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
  },
});

export default RedeemCoinsPage;
