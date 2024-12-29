import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, doc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import CustomButton from '../CustomButton';
import { useColorScheme } from 'react-native';

export default function GroupChatHeader({ group, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddMember = () => {
    if (currentUser.email !== group.createdBy) {
      Alert.alert('Permission Denied', 'Only the group creator can add new members.');
      return;
    }
    setModalVisible(true);
  };

  const handleUserSelect = (user) => {
    if (group.members.includes(user.email)) {
      Alert.alert('User Already a Member', 'This user is already a member of the group.');
      return;
    }
    setSelectedUser(user);
  };

  const handleAddMemberSubmit = async () => {
    if (!selectedUser) return;

    setLoading(true);
    const db = getFirestore();
    const groupRef = doc(db, 'groups', group.id);

    try {
      await updateDoc(groupRef, {
        members: arrayUnion(selectedUser.email),
      });
      setModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error adding member:', error);
      Alert.alert('Error', 'Failed to add new member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BACKGROUND }]}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Group Avatar */}
      <Image source={{ uri: group.profilePicture }} style={styles.groupAvatar} />

      {/* Group Info */}
      <View style={styles.groupInfo}>
        <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
        <Text style={styles.groupMembers} numberOfLines={1}>
          {group.members.length} members
        </Text>
      </View>

      {/* Add Member Button */}
      <TouchableOpacity onPress={handleAddMember} style={styles.addMemberButton}>
        <MaterialIcons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Member Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Member</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.userItem,
                    selectedUser && selectedUser.id === item.id && styles.selectedUserItem,
                  ]}
                  onPress={() => handleUserSelect(item)}
                >
                  <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                  <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                </TouchableOpacity>
              )}
            />
            {selectedUser && (
              <CustomButton title="Confirm" onPress={handleAddMemberSubmit} loading={loading} />
            )}
            <CustomButton title="Cancel" onPress={() => setModalVisible(false)} loading={false} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 40, // Add padding at the top
  },
  backButton: {
    marginRight: 10,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#fff',
  },
  groupMembers: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#fff',
  },
  addMemberButton: {
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedUserItem: {
    backgroundColor: '#e0e0e0',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});