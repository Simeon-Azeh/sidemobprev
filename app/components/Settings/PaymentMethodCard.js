import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';

export default function PaymentMethodCard({ method, icon }) {
  const colorScheme = useColorScheme();
  const themeTextColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.DARK_TEXT;
  const themeIconColor = colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE;

  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={24} color={themeIconColor} />
      <Text style={[styles.text, { color: themeTextColor }]}>{method}</Text>
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
  },
});