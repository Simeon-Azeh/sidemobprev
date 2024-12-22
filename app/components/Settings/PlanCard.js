import React from 'react';
import { TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import Colors from '../../../assets/Utils/Colors';

const { width: screenWidth } = Dimensions.get('window');

export default function PlanCard({ name, price, description, active }) {
  return (
    <TouchableOpacity style={[styles.planCard, active && styles.activePlan]}>
      <Text style={{ fontSize: screenWidth * 0.04, fontFamily: 'Poppins-Medium', color: active ? Colors.WHITE : Colors.SECONDARY }}>{name}</Text>
      <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', color: active ? Colors.WHITE : Colors.SECONDARY }}>{price}</Text>
      <Text style={{ fontSize: screenWidth * 0.03, fontFamily: 'Poppins-Medium', color: active ? Colors.WHITE : Colors.SECONDARY }}>{description}</Text>
      {active ? (
        <TouchableOpacity style={styles.planButton}>
          <Text style={{ color: Colors.PRIMARY, fontFamily: 'Poppins-Medium' }}>Cancel Subscription</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{ ...styles.planButton, backgroundColor: Colors.PRIMARY }}>
          <Text style={{ color: Colors.WHITE, fontFamily: 'Poppins-Medium' }}>Select Plan</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  planCard: {
    padding: 20,
    backgroundColor: '#F9FBFE',
    borderRadius: 10,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    marginBottom: 10,
  },
  activePlan: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY
  },
  planButton: {
    marginTop: 10,
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center'
  },
});