import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

export default function GroupCreationModal({ visible, onClose, users }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupProfilePicture, setGroupProfilePicture] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user)
        ? prevSelectedUsers.filter((u) => u !== user)
        : [...prevSelectedUsers, user]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }

    setLoading(true);

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const db = getFirestore();
    const groupData = {
      name: groupName,
      description: groupDescription,
      profilePicture: groupProfilePicture || 'default_avatar_url', // Ensure a default avatar URL if none is provided
      members: selectedUsers.map((user) => user.email),
      createdBy: currentUser.email,
      visibility: isPublic ? 'public' : 'private',
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'groups'), groupData);
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Create New Group</Text>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TextInput
          style={styles.input}
          placeholder="Group Description"
          value={groupDescription}
          onChangeText={setGroupDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Profile Picture URL"
          value={groupProfilePicture}
          onChangeText={setGroupProfilePicture}
        />
        <View style={styles.visibilityContainer}>
          <TouchableOpacity
            style={[styles.visibilityButton, isPublic && styles.selectedVisibilityButton]}
            onPress={() => setIsPublic(true)}
          >
            <Text style={styles.visibilityButtonText}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.visibilityButton, !isPublic && styles.selectedVisibilityButton]}
            onPress={() => setIsPublic(false)}
          >
            <Text style={styles.visibilityButtonText}>Private</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={users}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.userItem,
                selectedUsers.includes(item) && styles.selectedUserItem,
              ]}
              onPress={() => toggleUserSelection(item)}
            >
              <Text style={styles.userName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        {loading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
              <Text style={styles.buttonText}>Create Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  visibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  visibilityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedVisibilityButton: {
   
    borderColor: Colors.SECONDARY,
    borderWidth: 2,
  },
  selectedVisibilityButtonText: {
    color: '#fff',
  },
  visibilityButtonText: {
    color: Colors.PRIMARY,
    fontFamily: 'Poppins-Medium',
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedUserItem: {
    backgroundColor: '#f0f0f0',
  },
  userName: {
    fontFamily: 'Poppins',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});