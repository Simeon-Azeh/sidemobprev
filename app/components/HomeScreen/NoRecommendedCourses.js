import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';

export default function NoRecommendedCourses() {
  return (
    <View style={styles.container}>
      <Ionicons name="book-outline" size={50} color={Colors.SECONDARY} style={styles.icon} />
      <Text style={styles.text}>No recommended courses available at the moment.</Text>
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
    color: Colors.SECONDARY,
    fontFamily: 'Poppins-Medium',
  },
});
