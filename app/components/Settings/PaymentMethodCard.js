import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';

export default function PaymentMethodCard({ method, icon }) {
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={24} color={Colors.SECONDARY} />
      <Text style={styles.text}>{method}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
});