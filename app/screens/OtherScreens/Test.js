import React, { useState, useCallback } from 'react';
import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Header from '../../components/General/Header';
import Welcome from '../../components/Tests/Welcome';
import PerformanceGraph from '../../components/Tests/PerformanceGraph';
import Achievement from '../../components/Tests/Achievement';
import Colors from '../../../assets/Utils/Colors';
import { useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function Test() {
  const [modalVisible, setModalVisible] = useState(false);
  const [numSubjects, setNumSubjects] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      // Reset state when the screen gains focus
      setModalVisible(false);
      setNumSubjects(0);
      setSubjects([]);
    }, [])
  );

  const handleSubjectsChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const handleGetStarted = () => {
    setSubjects(Array(numSubjects).fill(''));
    setModalVisible(true);
  };

  const handleTakeTest = () => {
    setModalVisible(false);
    // Navigate to Quiz Instructions Page
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request or any other async operation
    setTimeout(() => {
      setRefreshing(false);
      // Reset state or fetch new data here
      setModalVisible(false);
      setNumSubjects(0);
      setSubjects([]);
    }, 2000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_BACKGROUND }]}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.PRIMARY]}
            tintColor={Colors.PRIMARY}
          />
        }
      >
        <View style={styles.welcomeContainer}>
          <Welcome onGetStarted={handleGetStarted} />
        </View>
        <View style={styles.performanceGraphContainer}>
          <PerformanceGraph />
        </View>
        <View style={styles.achievementContainer}>
          <Achievement />
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colorScheme === 'light' ? '#fff' : Colors.DARK_SECONDARY }]}>
            <Text style={[styles.modalTitle, { color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}>Select Subjects</Text>
            <TextInput
              style={[styles.input, { borderColor: colorScheme === 'light' ? '#ccc' : Colors.DARK_BORDER, color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}
              placeholder="Number of Subjects"
              placeholderTextColor={colorScheme === 'light' ? '#888' : '#ccc'}
              keyboardType="numeric"
              onChangeText={(value) => setNumSubjects(parseInt(value))}
              value={numSubjects.toString()}
            />
            {Array.from({ length: numSubjects }).map((_, index) => (
              <TextInput
                key={index}
                style={[styles.input, { borderColor: colorScheme === 'light' ? '#ccc' : Colors.DARK_BORDER, color: colorScheme === 'light' ? Colors.SECONDARY : Colors.WHITE }]}
                placeholder={`Subject ${index + 1}`}
                placeholderTextColor={colorScheme === 'light' ? '#888' : '#ccc'}
                onChangeText={(value) => handleSubjectsChange(index, value)}
                value={subjects[index]}
              />
            ))}
            <TouchableOpacity style={styles.button} onPress={handleTakeTest}>
              <Text style={styles.buttonText}>Take Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  welcomeContainer: {
    marginVertical: 20,
  },
  performanceGraphContainer: {
    marginVertical: 20,
  },
  achievementContainer: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#9835ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});