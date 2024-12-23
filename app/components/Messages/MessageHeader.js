import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

export default function MessageHeader({ setSearchText }) {
  const navigation = useNavigation();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchTextState] = useState('');

  const handleSearchTextChange = (text) => {
    setSearchTextState(text);
    setSearchText(text);
  };

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
            onChangeText={handleSearchTextChange}
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
});