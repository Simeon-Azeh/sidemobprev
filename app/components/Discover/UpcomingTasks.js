import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Colors from '../../../assets/Utils/Colors'; // Adjust the path if needed
import Icon from 'react-native-vector-icons/FontAwesome5'; // Import icon library
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UpcomingTasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const db = getFirestore();

      try {
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        const tasksData = [];
        const assessmentsData = [];
        const deadlinesData = [];

        tasksSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.type === 'task') {
            tasksData.push({ id: doc.id, ...data });
          } else if (data.type === 'assessment') {
            assessmentsData.push({ id: doc.id, ...data });
          } else if (data.type === 'deadline') {
            deadlinesData.push({ id: doc.id, ...data });
          }
        });

        setTasks(tasksData);
        setAssessments(assessmentsData);
        setDeadlines(deadlinesData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handlePress = (item) => {
    // Handle item press, e.g., navigate to a details screen or show more information
    console.log('Pressed:', item);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Tasks</Text>
      {tasks.map(task => (
        <TouchableOpacity key={task.id} style={styles.card} onPress={() => handlePress(task)}>
          <Icon name={task.icon} size={24} color={Colors.PRIMARY} style={styles.icon} />
          <View style={styles.cardContent}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.date}>{task.dueDate}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#888" style={styles.chevron} />
        </TouchableOpacity>
      ))}

      <Text style={styles.header}>Upcoming Assessments</Text>
      {assessments.map(assessment => (
        <TouchableOpacity key={assessment.id} style={styles.card} onPress={() => handlePress(assessment)}>
          <Icon name={assessment.icon} size={24} color={Colors.PRIMARY} style={styles.icon} />
          <View style={styles.cardContent}>
            <Text style={styles.title}>{assessment.title}</Text>
            <Text style={styles.date}>{assessment.date}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#888" style={styles.chevron} />
        </TouchableOpacity>
      ))}

      <Text style={styles.header}>Course Deadlines</Text>
      {deadlines.map(deadline => (
        <TouchableOpacity key={deadline.id} style={styles.card} onPress={() => handlePress(deadline)}>
          <Icon name={deadline.icon} size={24} color={Colors.PRIMARY} style={styles.icon} />
          <View style={styles.cardContent}>
            <Text style={styles.title}>{deadline.title}</Text>
            <Text style={styles.date}>{deadline.date}</Text>
          </View>
          <Icon name="chevron-right" size={16} color="#888" style={styles.chevron} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  header: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2, // for shadow effect on Android
    shadowColor: '#000', // for shadow effect on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'space-between', // Align items to edges
  },
  icon: {
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: screenWidth * 0.03,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  date: {
    fontSize: screenWidth * 0.025,
    color: '#888',
    fontFamily: 'Poppins-Medium',
  },
  chevron: {
    marginLeft: 10,
  },
});

export default UpcomingTasks;