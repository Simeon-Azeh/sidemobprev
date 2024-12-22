import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../assets/Utils/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import { format } from 'date-fns';
import { auth } from '../../../firebaseConfig'; 


const screenWidth = Dimensions.get('window').width;

const TaskListComponent = ({ tasks, addTask, deleteTask, completeTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
  const [newTaskIcon, setNewTaskIcon] = useState('assignment');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllUpcomingTasks, setShowAllUpcomingTasks] = useState(false);

  const handleAddTask = async () => {
    if (newTaskTitle && newTaskDueDate) {
      setLoading(true);
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate.toISOString(),
        icon: newTaskIcon,
        email: auth.currentUser.email,
        completed: false,
      };
      await addTask(newTask);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate(new Date());
      setNewTaskIcon('assignment');
      setLoading(false);
    }
  };

  const handleConfirmDate = (date) => {
    setShowDatePicker(false);
    setNewTaskDueDate(date);
    setShowTimePicker(true);
  };

  const handleConfirmTime = (time) => {
    setShowTimePicker(false);
    const updatedDate = new Date(newTaskDueDate);
    updatedDate.setHours(time.getHours());
    updatedDate.setMinutes(time.getMinutes());
    setNewTaskDueDate(updatedDate);
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteTask(taskId)
        }
      ]
    );
  };

  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
  };

  const getStatus = (dueDate, completed) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (completed) {
      return 'Completed';
    } else if (due < now) {
      return 'Missed';
    } else {
      return 'Ongoing';
    }
  };

  const filteredTasks = showAllTasks ? tasks : tasks.filter(task => getStatus(task.dueDate, task.completed) === 'Ongoing');
  const displayedTasks = showAllUpcomingTasks ? filteredTasks : filteredTasks.slice(0, 4);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.headerText}>Upcoming Tasks</Text>
      {displayedTasks.length === 0 ? (
        <View style={styles.noTasksContainer}>
        <MaterialIcons name="event-note" size={50} color="#bbb" />
        <Text style={styles.noTasksTitle}>Hurray!!!, No task today!🎊</Text>
        <Text style={styles.noTasksMessage}>
          Stay organized and productive. Create your first task now to get started on your journey to success!
        </Text>
      </View>
      ) : (
        <View>
          {displayedTasks.map((task, index) => (
            <View key={task.id} style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <TouchableOpacity
                style={[
                  styles.taskItem,
                  task.completed && styles.completedTaskItem,
                  !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskItem,
                  !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && styles.ongoingTaskItem,
                ]}
                onPress={() => handleCompleteTask(task.id)}
                onLongPress={() => handleDeleteTask(task.id)}
              >
                <MaterialIcons name={task.icon} size={24} color={task.completed ? Colors.WHITE : Colors.PRIMARY} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={[styles.taskTitle, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && styles.ongoingTaskText]}>{task.title}</Text>
                  <Text style={[styles.taskDescription, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && styles.ongoingTaskText]}>{task.description}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.taskDate, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && styles.ongoingTaskText]}>{format(new Date(task.dueDate), 'MMMM d, h:mma')}</Text>
                  <Text style={[styles.taskStatus, task.completed && styles.completedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Missed' && styles.missedTaskText, !task.completed && getStatus(task.dueDate, task.completed) === 'Ongoing' && styles.ongoingTaskText]}>{getStatus(task.dueDate, task.completed)}   {task.completed && <MaterialIcons name="check-circle" size={14} color="white" />}</Text>
                </View>
              </TouchableOpacity>
              {index % 2 === 1 && <View style={{ width: '100%', height: 10 }} />} 
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => setShowAllUpcomingTasks(!showAllUpcomingTasks)} style={styles.showAllButton}>
        <Text style={styles.showAllButtonText}>{showAllUpcomingTasks ? 'Show Less' : 'Show All Upcoming Tasks'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowAllTasks(!showAllTasks)} style={styles.showAllButton}>
        <Text style={styles.showAllButtonText}>{showAllTasks ? 'Show Ongoing Tasks' : 'Show All Tasks'}</Text>
      </TouchableOpacity>
      <View style={styles.addTaskContainer}>
        <TextInput
          placeholder="Task Title"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Task Description"
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>{format(newTaskDueDate, 'MMMM d, h:mma')}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setShowDatePicker(false)}
        />
        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={() => setShowTimePicker(false)}
        />
        <RNPickerSelect
          onValueChange={(value) => setNewTaskIcon(value)}
          items={[
            { label: 'Assignment', value: 'assignment' },
            { label: 'Quiz', value: 'quiz' },
            { label: 'Essay', value: 'description' },
          ]}
          style={pickerStyles}
          placeholder={{ label: 'Select an icon...', value: null }}
          value={newTaskIcon}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text style={styles.addButtonText}>Add Task</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: screenWidth * 0.045,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  noTasksText: {
    fontSize: screenWidth * 0.035,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    height: 80,
  },
  completedTaskItem: {
    backgroundColor: Colors.PRIMARY,
  },
  ongoingTaskItem: {
    borderWidth: 1,
    borderColor: Colors.SECONDARY,
  },
  missedTaskItem: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  taskDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  taskStatus: {
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  completedTaskText: {
    color: Colors.WHITE,
  },
  ongoingTaskText: {
    color: Colors.SECONDARY,
  },
  missedTaskText: {
    color: 'red',
  },
  sectionHeader: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
    marginVertical: 10,
  },
  addTaskContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
  },
  datePickerText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.SECONDARY,
  },
  addButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
  },
  showAllButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
  },
  showAllButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
  },
  noTasksContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  noTasksTitle: {
    fontSize: 20,
    color: Colors.SECONDARY,
    marginVertical: 5,
    fontFamily: 'Poppins-Medium',
  },
  noTasksMessage: {
    fontSize: 12,
    textAlign: 'center',
    color: '#777',
    marginTop: 2,
    fontFamily: 'Poppins',
  },
});

const pickerStyles = {
  inputAndroid: {
    color: Colors.SECONDARY,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: Colors.WHITE,
    fontFamily: 'Poppins-Medium',
  },
  inputIOS: {
    color: Colors.SECONDARY,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontFamily: 'Poppins-Medium',
  },
  
};

export default TaskListComponent;