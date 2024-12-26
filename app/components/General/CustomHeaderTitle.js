import React from 'react';
import { Text, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomHeaderTitle = ({ title }) => {
  const colorScheme = useColorScheme();
  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;

  return (
    <Text style={[styles.headerTitle, { color: themeTextColor }]}>{title}</Text>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
  },
});

export default CustomHeaderTitle;