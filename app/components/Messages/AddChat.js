import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

export default function AddChatModal({ visible, onClose, onAddChat }) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const colorScheme = useColorScheme();

  const handleSearch = async () => {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '>=', searchText), where('email', '<=', searchText + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSearchResults(users);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
          <Text style={[styles.modalTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Add Chat</Text>
          <TextInput
            style={[styles.searchInput, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY, color: colorScheme === 'light' ? '#000' : '#fff' }]}
            placeholder="Search by email"
            placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem} onPress={() => onAddChat(item)}>
                <Text style={[styles.userName, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>{item.email}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: screenWidth * 0.8,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});