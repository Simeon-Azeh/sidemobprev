import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';

export default function NoRecommendedCourses() {
  const colorScheme = useColorScheme();

  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeIconColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE;

  return (
    <View style={styles.container}>
      <Ionicons name="book-outline" size={50} color={themeIconColor} style={styles.icon} />
      <Text style={[styles.text, { color: themeTextColor }]}>No recommended courses available at the moment.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});