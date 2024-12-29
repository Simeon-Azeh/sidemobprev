import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function MessageHeader({ setSearchText }) {
  const navigation = useNavigation();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchTextState] = useState('');
  const colorScheme = useColorScheme();

  const handleSearchTextChange = (text) => {
    setSearchTextState(text);
    setSearchText(text);
  };

  const themeBackgroundColor = colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND;
  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE;
  const themeInputBackgroundColor = colorScheme === 'light' ? '#f0f0f0' : Colors.DARK_SECONDARY;
  const themeInputBorderColor = colorScheme === 'light' ? '#ddd' : Colors.DARK_BORDER;
  const themePlaceholderTextColor = colorScheme === 'light' ? '#888' : '#aaa';

  return (
    <View>
      <View style={[styles.headerContainer, { backgroundColor: themeBackgroundColor }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={30} color={themeTextColor} />
        </TouchableOpacity>
        {isSearchActive ? (
          <TextInput
            style={[styles.searchInput, { backgroundColor: themeInputBackgroundColor, borderColor: themeInputBorderColor, color: themeTextColor }]}
            value={searchText}
            onChangeText={handleSearchTextChange}
            onBlur={() => setIsSearchActive(false)}
            autoFocus
            placeholder="Search..."
            placeholderTextColor={themePlaceholderTextColor}
          />
        ) : (
          <Text style={[styles.title, { color: themeTextColor }]}>Messages</Text>
        )}
        <TouchableOpacity onPress={() => setIsSearchActive(!isSearchActive)}>
          <Icon name="search" size={30} color={themeTextColor} />
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
    marginTop: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: screenWidth * 0.03,
  },
});