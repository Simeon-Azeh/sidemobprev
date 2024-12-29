import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import redeemImg from '../../../assets/Images/redeem.png';
import DesignUi from '../../../assets/Images/DesignUi.png';
import DesignUi2 from '../../../assets/Images/DesignUi2.png';
import { getFirestore, doc, getDocs, updateDoc, collection, addDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useColorScheme } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RedeemCoinsPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalCoins, setTotalCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const colorScheme = useColorScheme();

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        const q = query(collection(db, 'quizResults'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        let coins = 0;
        querySnapshot.forEach((doc) => {
          coins += doc.data().coinsEarned || 0;
        });
        setTotalCoins(coins);
      } catch (error) {
        console.error("Error fetching user coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCoins();
  }, [user.uid]);

  const educationItems = [
    { id: '1', name: 'Pencil', icon: 'pencil-outline', coins: 300 },
    { id: '2', name: 'Books', icon: 'book-outline', coins: 500 },
    { id: '3', name: 'Notebook', icon: 'journal-outline', coins: 400 },
  ];
  const partners = [
    { id: '4', name: 'Partner 1', icon: 'business', coins: 800 },
    { id: '5', name: 'Partner 2', icon: 'briefcase', coins: 900 },
  ];

  const handleRedeemPress = (item) => {
    if (totalCoins < item.coins) {
      Alert.alert('Insufficient Coins', 'You do not have enough coins to redeem this item.');
      return;
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const generateScratchCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleRedeemConfirm = async () => {
    setRedeeming(true);
    try {
      const newTotalCoins = totalCoins - selectedItem.coins;
  
      // Update the user's coins in quizResults
      const q = query(collection(db, 'quizResults'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      let remainingCoins = selectedItem.coins;
  
      for (const docSnapshot of querySnapshot.docs) {
        const quizResult = docSnapshot.data();
        if (remainingCoins <= 0) break;
  
        const coinsToDeduct = Math.min(quizResult.coinsEarned, remainingCoins);
        remainingCoins -= coinsToDeduct;
  
        await updateDoc(doc(db, 'quizResults', docSnapshot.id), {
          coinsEarned: quizResult.coinsEarned - coinsToDeduct,
        });
      }
  
      const scratchCode = generateScratchCode();
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
  
      await addDoc(collection(db, 'CoinsRedeemed'), {
        userId: user.uid,
        itemName: selectedItem.name,
        itemId: selectedItem.id,
        coinsSpent: selectedItem.coins,
        scratchCode: scratchCode,
        redeemedAt: new Date(),
        expirationDate: expirationDate,
        redeemed: false, // Add redeemed field with default value false
      });
  
      setTotalCoins(newTotalCoins);
      setModalVisible(false);
      navigation.navigate('CelebrationPage', { 
        item: selectedItem, 
        scratchCode: scratchCode, 
        expirationDate: expirationDate.toLocaleDateString(), 
        coinsSpent: selectedItem.coins 
      });
    } catch (error) {
      console.error("Error redeeming item:", error);
      Alert.alert('Error', 'There was an error redeeming the item. Please try again.');
    } finally {
      setRedeeming(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY, marginBottom: 15 }]}>
      <View style={styles.cardContent}>
        <Ionicons name={item.icon} size={30} color={Colors.PRIMARY} style={styles.icon} />
        <Text style={[styles.cardText, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>{item.name}</Text>
      </View>
      <View style={styles.cardCutOut}>
        <View style={[styles.circleLeft, { backgroundColor: colorScheme === 'light' ? '#f2f2f2' : Colors.DARK_BACKGROUND }]} />
        <Text style={[styles.dash, { color: colorScheme === 'light' ? '#f2f2f2' : Colors.DARK_BACKGROUND }]}>--------------------------------</Text>
        <View style={[styles.circleRight, { backgroundColor: colorScheme === 'light' ? '#f2f2f2' : Colors.DARK_BACKGROUND }]} />
      </View>
      <TouchableOpacity style={[styles.redeemButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON, borderColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BORDER, borderWidth: colorScheme === 'light' ? 0 : 1 }]} onPress={() => handleRedeemPress(item)}>
        <Text style={styles.redeemButtonText}>
          REDEEM {item.coins} <FontAwesome6 name="coins" size={14} color="#fff" />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colorScheme === 'light' ? Colors.LIGHT_BACKGROUND : Colors.DARK_BACKGROUND }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_HEADER }]}>
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
      <Text style={[styles.sectionTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>Education</Text>
      <FlatList
        data={educationItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slider}
      />

      {/* Our Partners Section */}
      <Text style={[styles.sectionTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>Our Partners</Text>
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
            <View style={[styles.modalContent, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Ionicons name="close" size={32} color={Colors.PRIMARY} />
              </TouchableOpacity>
              <Image
                source={redeemImg} // Replace with actual image source
                style={styles.modalImage}
              />
              <Text style={[styles.modalTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>Are you sure you want to redeem?</Text>
              <Text style={[styles.modalDescription, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT }]}>
                Do you want to redeem {selectedItem.coins} coins for {selectedItem.name}?
              </Text>
              {redeeming ? (
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
              ) : (
                <TouchableOpacity style={[styles.confirmButton, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON, borderColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BORDER, borderWidth: colorScheme === 'light' ? 0 : 1 }]} onPress={handleRedeemConfirm}>
                  <Text style={styles.confirmButtonText}>REDEEM</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
    marginLeft: 20,
    marginVertical: 10,
  },
  slider: {
    paddingHorizontal: 10,
  },
  card: {
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
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
  },
  circleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    left: -10,
  },
  circleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    right: -10,
  },
  redeemButton: {
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
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButton: {
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