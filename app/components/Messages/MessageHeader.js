import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const { width: screenWidth } = Dimensions.get('window');

export default function MessageHeader({ addContact }) {
  const navigation = useNavigation();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchText.trim() === '') {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const db = getFirestore();
        const usersRef = collection(db, 'users');

        // Search by firstName
        const firstNameQuery = query(usersRef, where('firstName', '>=', searchText), where('firstName', '<=', searchText + '\uf8ff'));
        const firstNameSnapshot = await getDocs(firstNameQuery);
        const firstNameResults = firstNameSnapshot.docs.map(doc => doc.data());

        // Search by lastName
        const lastNameQuery = query(usersRef, where('lastName', '>=', searchText), where('lastName', '<=', searchText + '\uf8ff'));
        const lastNameSnapshot = await getDocs(lastNameQuery);
        const lastNameResults = lastNameSnapshot.docs.map(doc => doc.data());

        // Search by email
        const emailQuery = query(usersRef, where('email', '>=', searchText), where('email', '<=', searchText + '\uf8ff'));
        const emailSnapshot = await getDocs(emailQuery);
        const emailResults = emailSnapshot.docs.map(doc => doc.data());

        // Combine results and remove duplicates
        const combinedResults = [...firstNameResults, ...lastNameResults, ...emailResults];
        const uniqueResults = Array.from(new Set(combinedResults.map(a => a.email)))
          .map(email => combinedResults.find(a => a.email === email));

        setSearchResults(uniqueResults);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchText]);

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={30} color={Colors.SECONDARY} />
        </TouchableOpacity>
        {isSearchActive ? (
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onBlur={() => setIsSearchActive(false)}
            autoFocus
            placeholder="Search..."
          />
        ) : (
          <Text style={styles.title}>Messages</Text>
        )}
        <TouchableOpacity onPress={() => setIsSearchActive(!isSearchActive)}>
          <Icon name="search" size={30} color={Colors.SECONDARY} />
        </TouchableOpacity>
      </View>
      {isSearchActive && (
        <View style={styles.resultsContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Searching...</Text>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => (
                <View style={styles.resultItem}>
                  <Text style={styles.resultText}>{item.firstName} {item.lastName} ({item.email})</Text>
                  <TouchableOpacity onPress={() => { addContact(item); setIsSearchActive(false); }}>
                    <Text style={styles.addContactButton}>Add Contact</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noResultsText}>No users found</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginTop: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    textAlign: 'center',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.03,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    paddingHorizontal: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  addContactButton: {
    color: Colors.PRIMARY,
    fontFamily: 'Poppins-Medium',
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    padding: 10,
  },
  noResultsText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    padding: 10,
  },
});