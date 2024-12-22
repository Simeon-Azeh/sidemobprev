import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../../components/General/Header';
import Welcome from '../../components/Tests/Welcome';
import PerformanceGraph from '../../components/Tests/PerformanceGraph';
import Achievement from '../../components/Tests/Achievement';

export default function Test() {
  const [modalVisible, setModalVisible] = useState(false);
  const [numSubjects, setNumSubjects] = useState(0);
  const [subjects, setSubjects] = useState([]);

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

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Subjects</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of Subjects"
              keyboardType="numeric"
              onChangeText={(value) => setNumSubjects(parseInt(value))}
              value={numSubjects.toString()}
            />
            {Array.from({ length: numSubjects }).map((_, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`Subject ${index + 1}`}
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
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    borderColor: '#ccc',
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
