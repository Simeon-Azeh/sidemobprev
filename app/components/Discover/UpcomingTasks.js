import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../../../assets/Utils/Colors'; // Adjust the path if needed
import Icon from 'react-native-vector-icons/FontAwesome5'; // Import icon library

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const UpcomingTasks = () => {
  // Sample data for upcoming tasks
  const tasks = [
    { id: 1, title: 'Math Assignment', dueDate: '2024-08-15', icon: 'book' },
    { id: 2, title: 'Science Project', dueDate: '2024-08-20', icon: 'flask' },
    { id: 3, title: 'History Essay', dueDate: '2024-08-25', icon: 'scroll' },
  ];

  const assessments = [
    { id: 1, title: 'Mid-Term Exam', date: '2024-08-18', icon: 'graduation-cap' },
    { id: 2, title: 'Final Project Presentation', date: '2024-08-30', icon: 'clipboard' },
  ];

  const deadlines = [
    { id: 1, title: 'Submit Research Paper', date: '2024-09-01', icon: 'file' },
    { id: 2, title: 'Complete Group Discussion', date: '2024-09-05', icon: 'users' },
  ];

  const handlePress = (item) => {
    // Handle item press, e.g., navigate to a details screen or show more information
    console.log('Pressed:', item);
  };

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
