import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Colors from '../../../assets/Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RedeemedTicketsPage = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const q = query(collection(db, 'CoinsRedeemed'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const ticketsData = querySnapshot.docs.map(doc => doc.data());
        setTickets(ticketsData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.uid]);

  const renderItem = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketTitle}>{item.itemName}</Text>
        <Text style={styles.ticketDetail}>💰 Coins Spent: {item.coinsSpent}</Text>
        <Text style={styles.ticketDetail}>🔑 Scratch Code: {item.scratchCode}</Text>
        <Text style={styles.ticketDetail}>
          📅 Expiration: {new Date(item.expirationDate.seconds * 1000).toLocaleDateString()}
        </Text>
        <Text style={styles.ticketDetail}>
          {item.redeemed ? '✅ Redeemed' : '❌ Not Redeemed'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : tickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="gift-outline" size={100} color={Colors.SECONDARY} />
          <Text style={styles.emptyStateText}>No redeemed rewards yet!  </Text>
          <TouchableOpacity style={styles.redeemButton} onPress={() => navigation.navigate('RedeemPage')}>
            <Text style={styles.redeemButtonText}>Redeem Coins</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 5,
  },
  ticketDetail: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins',
    color: Colors.SECONDARY,
    marginBottom: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  redeemButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
  },
});

export default RedeemedTicketsPage;