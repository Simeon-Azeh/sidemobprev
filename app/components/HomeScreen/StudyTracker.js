import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; // Import Expo Icons
import Colors from '../../../assets/Utils/Colors';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../../firebaseConfig';
import BarChartComponent from './BarChart';
import TaskListComponent from './TaskList';
import StudyTrackerSkeleton from '../StudyTrackerSkeleton';

const StudyTracker = () => {
  const [isChartView, setIsChartView] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const q = query(collection(db, 'tasks'), where('email', '==', user.email));
          const querySnapshot = await getDocs(q);
          const fetchedTasks = [];
          querySnapshot.forEach((doc) => {
            fetchedTasks.push({ ...doc.data(), id: doc.id });
          });
          setTasks(fetchedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'tasks'), task);
      setTasks([...tasks, { ...task, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const db = getFirestore();
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { completed: true });
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)));
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={isChartView ? 'Tasks' : 'Chart'}
          icon={
            isChartView ? (
              <FontAwesome name="tasks" size={20} color="white" style={styles.iconStyle} />
            ) : (
              <FontAwesome name="bar-chart" size={20} color="white" style={styles.iconStyle} />
            )
          }
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.titleStyle}
          onPress={() => setIsChartView(!isChartView)}
        />
      </View>
      {loading ? (
        <StudyTrackerSkeleton />
      ) : isChartView ? (
        <BarChartComponent />
      ) : (
        <TaskListComponent
          tasks={tasks}
          addTask={addTask}
          deleteTask={deleteTask}
          completeTask={completeTask}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  buttonContainer: {
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
  },
  titleStyle: {
    marginLeft: 5,
    fontFamily: 'Poppins-Medium',
  },
  iconStyle: {
    marginRight: 5,
  },
});

export default StudyTracker;