import React from 'react';
import { TouchableOpacity, Text, Dimensions, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

export default function PlanCard({ name, price, description, active, onSelect, loading }) {
  const colorScheme = useColorScheme();

  const themeCardStyle = colorScheme === 'light' ? styles.lightCard : styles.darkCard;
  const themeActiveCardStyle = colorScheme === 'light' ? styles.activeLightCard : styles.activeDarkCard;
  const themeTextStyle = colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themeActiveTextStyle = colorScheme === 'light' ? styles.activeLightText : styles.activeDarkText;
  const themeButtonStyle = colorScheme === 'light' ? styles.lightButton : styles.darkButton;
  const themeButtonBorderStyle = colorScheme === 'dark' ? styles.darkButtonBorder : {};

  return (
    <TouchableOpacity style={[styles.planCard, themeCardStyle, active && themeActiveCardStyle]} onPress={onSelect} disabled={loading}>
      <Text style={[styles.planText, active ? themeActiveTextStyle : themeTextStyle]}>{name}</Text>
      <Text style={[styles.planText, active ? themeActiveTextStyle : themeTextStyle]}>{price}</Text>
      <Text style={[styles.planText, active ? themeActiveTextStyle : themeTextStyle]}>{description}</Text>
      {active ? (
        <TouchableOpacity style={[styles.planButton, themeButtonStyle, themeButtonBorderStyle]} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colorScheme === 'light' ? Colors.WHITE : Colors.WHITE} />
          ) : (
            <Text style={{ color: colorScheme === 'light' ? Colors.WHITE : Colors.WHITE, fontFamily: 'Poppins-Medium' }}>Cancel</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.planButton, themeButtonStyle, themeButtonBorderStyle]} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text style={{ color: Colors.WHITE, fontFamily: 'Poppins-Medium' }}>Select Plan</Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  planCard: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  lightCard: {
    backgroundColor: '#F9FBFE',
    borderColor: Colors.GRAY,
  },
  darkCard: {
    backgroundColor: Colors.DARK_SECONDARY,
    borderColor: Colors.DARK_BORDER,
  },
  activeLightCard: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  activeDarkCard: {
    backgroundColor: '#1b1b1b',
    borderColor: Colors.DARK_BORDER,
  },
  planText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
  },
  lightText: {
    color: Colors.SECONDARY,
  },
  darkText: {
    color: Colors.DARK_TEXT,
  },
  activeLightText: {
    color: Colors.WHITE,
  },
  activeDarkText: {
    color: Colors.WHITE,
  },
  planButton: {
    marginTop: 10,
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  lightButton: {
    backgroundColor: Colors.PRIMARY,
  },
  darkButton: {
    backgroundColor: Colors.DARK_BUTTON,
  },
  darkButtonBorder: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
});