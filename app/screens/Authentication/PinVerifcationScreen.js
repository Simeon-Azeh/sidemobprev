import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PinVerificationScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinVerification = async () => {
    const storedPin = await AsyncStorage.getItem('userPin');
    if (pin === storedPin) {
      navigation.replace('Main');
    } else {
      setError('Incorrect PIN');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="numeric"
        value={pin}
        onChangeText={setPin}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Verify PIN" onPress={handlePinVerification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});