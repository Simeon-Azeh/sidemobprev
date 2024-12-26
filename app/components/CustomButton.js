import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';

export default function CustomButton({ title, onPress, loading }) {
  const colorScheme = useColorScheme();
  const themeButtonBackgroundColor = colorScheme === 'light' ? Colors.PRIMARY : Colors.DARK_BUTTON;
  const themeButtonTextColor = Colors.WHITE;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: themeButtonBackgroundColor }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color={themeButtonTextColor} /> : <Text style={[styles.buttonText, { color: themeButtonTextColor }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});