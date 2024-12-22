import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CustomHeaderTitle = ({ title }) => (
  <Text style={styles.headerTitle}>{title}</Text>
);

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
});

export default CustomHeaderTitle;
